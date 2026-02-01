
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Task, Recommendation, Language } from '../types';
import { translations } from '../translations';
import { getProductivityInsights, getDailySummary, chatWithAI } from '../services/geminiService';

interface Props { tasks: Task[]; lang: Language; }

const Assistant: React.FC<Props> = ({ tasks, lang }) => {
  const t = translations[lang];
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [summary, setSummary] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const weeklyStats = useMemo(() => {
    const stats = [];
    const dayLabels: Record<Language, string[]> = {
      uz: ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sha'],
      ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    };
    const labels = dayLabels[lang];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayTasks = tasks.filter(task => task.date === dateStr);
      const completed = dayTasks.filter(task => task.completed).length;
      const rate = dayTasks.length > 0 ? (completed / dayTasks.length) * 100 : 0;
      stats.push({ label: labels[d.getDay()], value: rate });
    }
    return stats;
  }, [tasks, lang]);

  const fetchInsights = async () => {
    if (tasks.length === 0) return;
    setLoading(true);
    try {
      const todayDate = new Date().toISOString().split('T')[0];
      const [insights, dailySummary] = await Promise.all([
        getProductivityInsights(tasks, lang),
        getDailySummary(tasks.filter(task => task.date === todayDate), lang)
      ]);
      setRecommendations(insights);
      setSummary(dailySummary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    setIsChatting(true);
    const response = await chatWithAI(chatInput, tasks, lang);
    setChatResponse(response || '');
    setChatInput('');
    setIsChatting(false);
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  useEffect(() => {
    fetchInsights();
  }, [lang]);

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      <div className="tg-card p-6 border border-black/5">
        <h3 className="text-[10px] font-black uppercase text-[var(--tg-hint)] tracking-widest mb-6">{t.assistant.weeklyResult}</h3>
        <div className="flex justify-between items-end h-24 space-x-2">
          {weeklyStats.map((day, i) => (
            <div key={i} className="flex flex-col items-center flex-1 group">
              <div className="w-full bg-gray-100 rounded-lg h-20 relative flex items-end overflow-hidden">
                <div 
                  className={`w-full transition-all duration-1000 ${day.value > 50 ? 'bg-[var(--tg-button)]' : 'bg-gray-300'}`}
                  style={{ height: `${Math.max(day.value, 5)}%` }}
                ></div>
              </div>
              <span className="text-[8px] font-bold mt-2 opacity-50">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase flex items-center">
          <i className="fa-solid fa-comments text-blue-500 mr-2"></i>
          {t.assistant.chatTitle}
        </h3>
        
        {isChatting && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-xl w-max animate-pulse">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-150"></div>
            </div>
            <span className="text-[10px] text-blue-500 font-bold uppercase">{t.assistant.thinking}</span>
          </div>
        )}

        {chatResponse && !isChatting && (
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 animate-slideUp">
            <p className="text-xs text-blue-900 leading-relaxed font-medium">{chatResponse}</p>
          </div>
        )}

        <div className="flex space-x-2">
          <input 
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChat()}
            placeholder={t.assistant.chatPlaceholder}
            className="flex-1 bg-gray-50 border-none px-4 py-3 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleChat}
            disabled={isChatting}
            className="w-12 h-12 bg-[var(--tg-button)] text-white rounded-xl flex items-center justify-center disabled:opacity-50"
          >
            {isChatting ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
          </button>
        </div>
        <div ref={scrollRef}></div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase text-[var(--tg-hint)] tracking-widest px-1">{t.assistant.recommendations}</h3>
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl"></div>)}
          </div>
        ) : (
          recommendations.map((rec, i) => (
            <div key={i} className="tg-card p-4 flex items-start space-x-4 border border-black/5">
              <div className={`p-3 rounded-xl ${
                rec.type === 'productivity' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
              }`}>
                <i className={`fa-solid ${rec.type === 'productivity' ? 'fa-bolt' : 'fa-seedling'}`}></i>
              </div>
              <div>
                <h4 className="text-xs font-black mb-1">{rec.title}</h4>
                <p className="text-[10px] text-[var(--tg-hint)] leading-tight">{rec.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Assistant;
