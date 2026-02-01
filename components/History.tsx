
import React, { useMemo } from 'react';
import { Task, Language } from '../types';
import { translations } from '../translations';

interface Props { tasks: Task[]; deleteTask: (id: string) => void; lang: Language; }

const History: React.FC<Props> = ({ tasks, deleteTask, lang }) => {
  const t = translations[lang];
  const groupedTasks = useMemo(() => {
    const groups: Record<string, Task[]> = {};
    tasks.forEach(task => {
      if (!groups[task.date]) groups[task.date] = [];
      groups[task.date].push(task);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [tasks]);

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xs font-black text-[var(--tg-hint)] uppercase tracking-widest">{t.history.title}</h2>
        <span className="text-[10px] opacity-50 font-bold">{groupedTasks.length} {t.history.days}</span>
      </div>

      {groupedTasks.length === 0 ? (
        <div className="py-20 text-center opacity-40">
          <i className="fa-solid fa-box-open text-4xl mb-3"></i>
          <p className="text-sm">{t.history.noHistory}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedTasks.map(([date, dayTasks]) => (
            <div key={date} className="space-y-2">
              <h3 className="text-xs font-bold px-1 text-[var(--tg-button)]">
                {new Date(date).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'ru' ? 'ru-RU' : 'uz-UZ', { month: 'long', day: 'numeric' })}
              </h3>
              <div className="tg-card overflow-hidden">
                {dayTasks.map((task, idx) => (
                  <div key={task.id} className={`p-4 flex items-center justify-between ${idx !== dayTasks.length - 1 ? 'border-b border-black/5' : ''}`}>
                    <div className="flex items-center space-x-3">
                      <i className={`fa-solid ${task.completed ? 'fa-check-circle text-green-500' : 'fa-circle text-black/10'} text-sm`}></i>
                      <span className={`text-sm ${task.completed ? 'opacity-50 line-through' : 'font-medium'}`}>{task.text}</span>
                    </div>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-red-300 hover:text-red-500 transition-colors"
                    >
                      <i className="fa-regular fa-trash-can text-[10px]"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
