import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface NslookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRun: (args: string) => void;
  isLoading: boolean;
  result: string | null;
  language: Language;
}

export const NslookupModal: React.FC<NslookupModalProps> = ({ 
  isOpen, 
  onClose, 
  onRun, 
  isLoading, 
  result,
  language 
}) => {
  const t = TRANSLATIONS[language];
  const [args, setArgs] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (args.trim()) {
      onRun(args.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            <div className="bg-indigo-600/20 p-1.5 rounded text-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
            </div>
            {t.nslookupTitle}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-hidden flex flex-col gap-4">
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 font-mono font-bold">{'>'} nslookup</span>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={args}
                onChange={(e) => setArgs(e.target.value)}
                placeholder={t.nslookupPlaceholder}
                className="w-full bg-slate-950 border border-slate-700 rounded-md py-2 pl-28 pr-4 text-slate-200 font-mono text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !args.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path></svg>
              )}
              {t.runCommand}
            </button>
          </form>

          <div className="flex-1 bg-black rounded-md border border-slate-800 p-4 overflow-auto min-h-[200px]">
            <div className="text-xs text-slate-500 uppercase mb-2 font-semibold tracking-wider border-b border-slate-800 pb-1">
              {t.commandOutput}
            </div>
            <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">
              {result || <span className="text-slate-600 opacity-50 cursor-blink">_</span>}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900/50 p-4 border-t border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};