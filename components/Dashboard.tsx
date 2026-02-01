
import React from 'react';
import { Task, Language } from '../types';
import { translations } from '../translations';

interface Props {
  tasks: Task[];
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  lang: Language;
}

const Dashboard: React.FC<Props> = ({ tasks, toggleTask, deleteTask, setTasks, lang }) => {
  const t = translations[lang];
  const today = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  const todayTasks = tasks.filter(task => task.date === today);
  const unfinishedYesterday = tasks.filter(task => task.date === yesterday && !task.completed);
  
  const completedToday = todayTasks.filter(task => task.completed).length;
  const progress = todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0;

  const transferTasks = () => {
    const updatedTasks = tasks.map(task => {
      if (task.date === yesterday && !task.completed) {
        return { ...task, date: today };
      }
      return task;
    });
    setTasks(updatedTasks);
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
  };

  const handleSendReport = () => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.HapticFeedback.impactOccurred('heavy');
      
      const taskList = todayTasks
        .map(task => `${task.completed ? '✅' : '❌'} ${task.text}`)
        .join('\n');

      const reportText = `📝 ${t.dashboard.reportTitle} (${new Date().toLocaleDateString()})\n\n` +
        `📊 ${t.dashboard.result}: ${progress.toFixed(0)}%\n` +
        `✅ ${t.dashboard.done}: ${completedToday}\n` +
        `❌ ${t.dashboard.remains}: ${todayTasks.length - completedToday}\n\n` +
        `${t.dashboard.tasks}: \n${taskList || t.dashboard.noTasks}\n\n` +
        `#report #productivity`;

      tg.sendData(reportText);
    } else {
      alert("Report Ready! (Only available inside Telegram)");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-br from-[#2481cc] to-[#4a90e2] p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <i className="fa-solid fa-chart-line text-6xl"></i>
        </div>
        <div className="relative z-10">
          <h2 className="text-5xl font-black mb-1">{progress.toFixed(0)}%</h2>
          <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">{t.dashboard.productivity}</p>
          
          <div className="mt-6 flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  progress >= (i + 1) * 20 ? 'bg-white' : 'bg-white/20'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {unfinishedYesterday.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-3xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
              <i className="fa-solid fa-rotate-left"></i>
            </div>
            <div>
              <p className="text-[11px] font-black text-amber-900">{t.dashboard.yesterdayPlans}</p>
              <p className="text-[10px] text-amber-700">{unfinishedYesterday.length} {t.dashboard.unfinished}</p>
            </div>
          </div>
          <button 
            onClick={transferTasks}
            className="bg-amber-600 text-white text-[9px] font-black px-4 py-2 rounded-xl"
          >
            {t.dashboard.transfer}
          </button>
        </div>
      )}

      <button 
        onClick={handleSendReport}
        disabled={todayTasks.length === 0}
        className="w-full bg-[var(--tg-button)] text-white py-4.5 rounded-2xl font-black text-sm flex items-center justify-center space-x-3 shadow-lg active:scale-95 transition-transform disabled:opacity-50"
      >
        <i className="fa-solid fa-paper-plane text-xs"></i>
        <span>{t.dashboard.sendReport}</span>
      </button>

      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-[var(--tg-hint)] uppercase tracking-widest px-1">{t.dashboard.todayList}</h3>
        {todayTasks.map(task => (
          <div 
            key={task.id}
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
              task.completed ? 'bg-transparent border-black/5 opacity-50' : 'bg-[var(--tg-secondary)] border-transparent'
            }`}
          >
            <div className="flex items-center space-x-4 flex-1" onClick={() => toggleTask(task.id)}>
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                task.completed ? 'bg-green-500 border-green-500' : 'bg-white border-black/10'
              }`}>
                {task.completed && <i className="fa-solid fa-check text-white text-[10px]"></i>}
              </div>
              <div>
                <p className={`text-xs font-bold ${task.completed ? 'line-through' : ''}`}>{task.text}</p>
                {task.timeEstimation && <span className="text-[9px] text-[var(--tg-hint)]">{task.timeEstimation}</span>}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {task.tags.includes('#goal') && <i className="fa-solid fa-star text-amber-400 text-[10px]"></i>}
              <button 
                onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors"
              >
                <i className="fa-regular fa-trash-can text-[10px]"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
