
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Language } from '../types';
import { translations } from '../translations';

interface Props { lang: Language; }

const BottomNav: React.FC<Props> = ({ lang }) => {
  const t = translations[lang];
  const location = useLocation();

  const navItems = [
    { path: '/', label: t.nav.home, icon: 'fa-house' },
    { path: '/planner', label: t.nav.plan, icon: 'fa-plus-circle' },
    { path: '/assistant', label: t.nav.ai, icon: 'fa-robot' },
    { path: '/history', label: t.nav.history, icon: 'fa-clock' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--tg-bg)] border-t border-black/5 safe-area-bottom flex justify-around items-center h-16 z-50 shadow-[0_-1px_10px_rgba(0,0,0,0.02)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              isActive ? 'text-[var(--tg-button)]' : 'text-[var(--tg-hint)]'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg mb-1`}></i>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
