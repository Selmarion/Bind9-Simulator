import React, { useState } from 'react';
import { ConfigType, FileConfig, Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface FileTabsProps {
  files: Record<string, FileConfig>;
  activeFileId: string;
  onFileChange: (id: string) => void;
  onAddFile: (name: string, type: ConfigType) => void;
  onDeleteFile: (id: string) => void;
  language: Language;
}

export const FileTabs: React.FC<FileTabsProps> = ({ files, activeFileId, onFileChange, onAddFile, onDeleteFile, language }) => {
  const t = TRANSLATIONS[language];
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<ConfigType>(ConfigType.NAMED_CONF);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAddFile(newName.trim(), newType);
      setIsCreating(false);
      setNewName('');
      setNewType(ConfigType.NAMED_CONF);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent activating the file when deleting
    
    if (Object.keys(files).length <= 1) {
      window.alert(t.deleteLastFile);
      return;
    }
    
    if (window.confirm(t.deleteConfirm)) {
      onDeleteFile(id);
    }
  };

  return (
    <div className="bg-slate-900 border-r border-slate-800 w-72 flex-shrink-0 flex flex-col h-full">
      {/* Header & Actions */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400 text-xs uppercase font-semibold tracking-wider">{t.files}</span>
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className={`p-1 rounded transition-colors ${isCreating ? 'bg-red-500/20 text-red-400' : 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40'}`}
            title={isCreating ? t.cancel : t.createFile}
          >
            {isCreating ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            )}
          </button>
        </div>

        {/* Creation Form */}
        {isCreating && (
          <form onSubmit={handleCreateSubmit} className="bg-slate-950/50 p-3 rounded border border-slate-700/50 space-y-2 animate-in slide-in-from-top-2 fade-in duration-200">
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">{t.fileName}</label>
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="db.internal"
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">{t.configType}</label>
              <select 
                value={newType}
                onChange={(e) => setNewType(e.target.value as ConfigType)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value={ConfigType.NAMED_CONF}>named.conf</option>
                <option value={ConfigType.FORWARD_ZONE}>{t.files} (Forward)</option>
                <option value={ConfigType.REVERSE_ZONE}>{t.files} (Reverse)</option>
              </select>
            </div>
            <button 
              type="submit"
              disabled={!newName.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs py-1.5 rounded transition-colors mt-1"
            >
              {t.create}
            </button>
          </form>
        )}
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {Object.values(files).map((file: FileConfig) => (
          <div
            key={file.id}
            onClick={() => onFileChange(file.id)}
            className={`group relative text-left px-3 py-2.5 rounded-md text-sm font-mono transition-all duration-200 flex items-center gap-3 cursor-pointer border
              ${activeFileId === file.id 
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-transparent hover:border-slate-700'}`}
          >
            {/* Icon based on type */}
            <div className={`flex-shrink-0 ${activeFileId === file.id ? 'text-indigo-400' : 'text-slate-600'}`}>
              {file.type === ConfigType.NAMED_CONF ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
              ) : file.type === ConfigType.FORWARD_ZONE ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="leading-none truncate" title={file.name}>{file.name}</div>
              <div className="text-[10px] opacity-50 mt-1 leading-none font-sans truncate" title={file.description}>{file.description}</div>
            </div>

            {/* Delete Button */}
            <button
              onClick={(e) => handleDeleteClick(e, file.id)}
              className="p-1.5 text-slate-600 hover:bg-red-500/20 hover:text-red-400 rounded transition-all flex-shrink-0"
              title={t.deleteConfirm}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
         <div className="text-xs text-slate-500 mb-2">{t.infoTitle}</div>
         <p className="text-xs text-slate-400 leading-relaxed">
           {t.infoText}
         </p>
      </div>
    </div>
  );
};
