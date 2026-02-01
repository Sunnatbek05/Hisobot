
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Overview', icon: 'fa-chart-pie' },
    { path: '/planner', label: 'Planner', icon: 'fa-calendar-plus' },
    { path: '/assistant', label: 'AI', icon: 'fa-robot' },
    { path: '/history', label: 'Archive', icon: 'fa-clock-rotate-left' },
  ];

  return (
    <aside className="w-16 md:w-64 bg-white border-r border-gray-100 flex flex-col transition-all" style={{ backgroundColor: 'var(--tg-theme-bg-color)', borderColor: 'rgba(0,0,0,0.05)' }}>
      <div className="p-4 md:p-6 flex items-center justify-center md:justify-start space-x-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: 'var(--tg-theme-button-color)' }}>
          KH
        </div>
        <span className="hidden md:block font-bold text-lg tracking-tight text-gray-800" style={{ color: 'var(--tg-theme-text-color)' }}>
          Hisobot
        </span>
      </div>

      <nav className="flex-1 mt-4 px-2 md:px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col md:flex-row items-center md:space-x-3 px-2 py-3 md:px-4 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 font-semibold' 
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
              style={isActive ? { 
                backgroundColor: 'var(--tg-theme-secondary-bg-color)', 
                color: 'var(--tg-theme-button-color)' 
              } : { color: 'var(--tg-theme-hint-color)' }}
            >
              <i className={`fa-solid ${item.icon} text-lg`}></i>
              <span className="text-[10px] md:text-sm mt-1 md:mt-0">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 hidden md:block border-t border-gray-50" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
        <p className="text-[10px] text-center text-gray-400 uppercase font-bold tracking-widest">v1.0.0-PRO</p>
      </div>
    </aside>
  );
};

export default Sidebar;
