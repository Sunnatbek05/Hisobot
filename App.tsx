
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Task, Language } from './types';
import { translations } from './translations';
import Dashboard from './components/Dashboard';
import Planner from './components/Planner';
import History from './components/History';
import Assistant from './components/Assistant';
import BottomNav from './components/BottomNav';

const AppContent: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('kh-tasks-v2');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('kh-lang');
    return (saved as Language) || 'uz';
  });

  const [isLoading, setIsLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
    }
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('kh-tasks-v2', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('kh-lang', language);
  }, [language]);

  const addTask = (text: string, date: string, tags: string[] = [], time?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      date,
      tags,
      timeEstimation: time
    };
    setTasks(prev => [...prev, newTask]);
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('warning');
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--tg-bg)]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-[var(--tg-button)] rounded-2xl mb-4"></div>
          <p className="text-xs font-black uppercase tracking-widest opacity-50">{t.appName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--tg-bg)]">
      <header className="p-4 flex justify-between items-center border-b border-black/5 bg-[var(--tg-bg)]">
        <h1 className="text-lg font-black tracking-tight italic">{t.appName}</h1>
        <div className="flex items-center space-x-2 bg-[var(--tg-secondary)] p-1 rounded-xl">
          {(['uz', 'ru', 'en'] as Language[]).map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase transition-all ${
                language === lang ? 'bg-[var(--tg-button)] text-white shadow-sm' : 'opacity-40'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto pb-24 p-4">
        <Routes>
          <Route path="/" element={<Dashboard tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} setTasks={setTasks} lang={language} />} />
          <Route path="/planner" element={<Planner addTask={addTask} tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} lang={language} />} />
          <Route path="/history" element={<History tasks={tasks} deleteTask={deleteTask} lang={language} />} />
          <Route path="/assistant" element={<Assistant tasks={tasks} lang={language} />} />
        </Routes>
      </main>

      <BottomNav lang={language} />
    </div>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
