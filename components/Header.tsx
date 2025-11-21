import React from 'react';
import { FileConfig } from '../types';

interface HeaderProps {
  activeFile: FileConfig;
}

export const Header: React.FC<HeaderProps> = ({ activeFile }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Bind9 Simulator <span className="text-indigo-400 text-sm font-normal ml-2">v1.1</span></h1>
          <p className="text-slate-400 text-xs">Онлайн тренажёр конфигурации DNS</p>
        </div>
      </div>
      <div className="hidden md:block text-slate-500 text-sm">
        Текущий файл: <span className="text-indigo-300 font-mono">{activeFile.name}</span>
        <span className="ml-2 text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400">{activeFile.type}</span>
      </div>
    </header>
  );
};