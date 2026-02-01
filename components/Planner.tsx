
import React, { useState, useEffect, useCallback } from 'react';
import { Task, Language } from '../types';
import { translations } from '../translations';

interface Props {
  tasks: Task[];
  addTask: (text: string, date: string, tags: string[], time?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  lang: Language;
}

const Planner: React.FC<Props> = ({ tasks, addTask, toggleTask, deleteTask, lang }) => {
  const t = translations[lang];
  const [newText, setNewText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeEst, setTimeEst] = useState('');
  const [isGoal, setIsGoal] = useState(false);

  const handleSave = useCallback(() => {
    if (newText.trim().length > 2) {
      const tags = isGoal ? ['#goal'] : [];
      addTask(newText, selectedDate, tags, timeEst);
      setNewText('');
      setTimeEst('');
      setIsGoal(false);
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
    }
  }, [newText, selectedDate, isGoal, timeEst, addTask]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      const mb = tg.MainButton;
      if (newText.trim().length > 2) {
        mb.setText(t.planner.save.toUpperCase());
        mb.show();
        mb.offClick(handleSave);
        mb.onClick(handleSave);
      } else {
        mb.hide();
      }
      return () => mb.offClick(handleSave);
    }
  }, [newText, handleSave, t]);

  const dayTasks = tasks.filter(task => task.date === selectedDate);
  const isValid = newText.trim().length > 2;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="tg-card p-6 space-y-5 border border-black/5 shadow-sm">
        <h2 className="text-[10px] font-black uppercase text-[var(--tg-hint)] tracking-widest flex items-center">
          <i className="fa-solid fa-pen-to-square mr-2"></i>
          {t.planner.addNew}
        </h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-[var(--tg-hint)] ml-1 uppercase tracking-tight">{t.planner.taskText}</label>
            <textarea 
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder={t.planner.placeholder}
              className="w-full bg-white border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[var(--tg-button)] min-h-[100px] shadow-inner resize-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-[var(--tg-hint)] ml-1 uppercase tracking-tight">{t.planner.date}</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-white px-4 py-3.5 rounded-2xl text-[11px] font-bold border-none shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-[var(--tg-hint)] ml-1 uppercase tracking-tight">{t.planner.time}</label>
              <input 
                type="text" 
                value={timeEst}
                onChange={(e) => setTimeEst(e.target.value)}
                placeholder={t.planner.timePlaceholder}
                className="w-full bg-white px-4 py-3.5 rounded-2xl text-[11px] font-bold border-none shadow-inner"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3 pt-2">
            <button 
              onClick={() => setIsGoal(!isGoal)}
              className={`w-full flex items-center justify-center space-x-2 py-4 rounded-2xl border-2 transition-all active:scale-95 ${
                isGoal 
                ? 'border-amber-400 bg-amber-50 text-amber-700' 
                : 'border-black/5 bg-black/5 text-[var(--tg-hint)]'
              }`}
            >
              <i className={`fa-solid ${isGoal ? 'fa-star' : 'fa-tag'} text-xs`}></i>
              <span className="text-[10px] font-black uppercase tracking-widest">{t.planner.mainGoal} (#goal)</span>
            </button>

            <button 
              onClick={handleSave}
              disabled={!isValid}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95 ${
                isValid 
                ? 'bg-[var(--tg-button)] text-white' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
              }`}
            >
              <i className="fa-solid fa-check-double"></i>
              <span>{t.planner.save}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3 pb-20">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-black text-[var(--tg-hint)] uppercase tracking-widest">
            {selectedDate === new Date().toISOString().split('T')[0] ? t.planner.today : selectedDate}
          </h3>
          <span className="text-[9px] font-bold bg-black/5 px-2 py-0.5 rounded-full">{dayTasks.length}</span>
        </div>
        
        {dayTasks.length === 0 ? (
          <div className="text-center py-12 bg-black/5 rounded-[32px] border border-dashed border-black/10">
            <p className="text-[10px] font-black text-[var(--tg-hint)] opacity-40 uppercase tracking-widest">{t.planner.noTasks}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {dayTasks.map(task => (
              <div key={task.id} className="tg-card p-4.5 flex items-center justify-between border border-black/5 animate-slideUp">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${task.tags.includes('#goal') ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-blue-400'}`}></div>
                  <span className="text-xs font-bold text-[var(--tg-text)]">{task.text}</span>
                </div>
                <div className="flex items-center space-x-3">
                  {task.timeEstimation && (
                    <span className="text-[8px] font-black bg-white px-2 py-1 rounded-lg opacity-60">
                      {task.timeEstimation}
                    </span>
                  )}
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-red-400 active:bg-red-50 transition-colors"
                  >
                    <i className="fa-regular fa-trash-can text-[10px]"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Planner;
