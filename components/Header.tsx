import React, { useState, useRef, useEffect } from 'react';
import { FileConfig, Language } from '../types';
import { TRANSLATIONS, LANGUAGES } from '../translations';

interface HeaderProps {
  activeFile: FileConfig;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeFile, language, onLanguageChange }) => {
  const t = TRANSLATIONS[language];
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center shadow-md relative z-50">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">{t.appTitle} <span className="text-indigo-400 text-sm font-normal ml-2">v1.1</span></h1>
          <p className="text-slate-400 text-xs">{t.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:block text-slate-500 text-sm text-right">
          <div>{t.currentFile} <span className="text-indigo-300 font-mono">{activeFile.name}</span></div>
          <div className="text-xs text-slate-600">{activeFile.type}</div>
        </div>

        {/* Language Switcher */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-300 focus:outline-none border border-transparent hover:border-slate-700"
            title="Change Language"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </button>

          {isLangMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-md shadow-xl overflow-hidden">
              {Object.entries(LANGUAGES).map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => {
                    onLanguageChange(code as Language);
                    setIsLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors ${
                    language === code ? 'text-indigo-400 font-semibold bg-slate-900/50' : 'text-slate-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
