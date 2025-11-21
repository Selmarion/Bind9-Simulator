import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileTabs } from './components/FileTabs';
import { CodeEditor } from './components/CodeEditor';
import { OutputConsole } from './components/OutputConsole';
import { INITIAL_FILES, FILE_TEMPLATES } from './constants';
import { ConfigType, FileConfig, AnalysisResult, ValidationResult, Language } from './types';
import { validateBindConfig, explainBindConfig } from './services/geminiService';
import { TRANSLATIONS } from './translations';

const App: React.FC = () => {
  // State for all files
  const [files, setFiles] = useState<Record<string, FileConfig>>(INITIAL_FILES);
  // State for currently active file ID
  const [activeFileId, setActiveFileId] = useState<string>('named-conf-local');
  // State for AI analysis result
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  // State for Language
  const [language, setLanguage] = useState<Language>('en');

  const t = TRANSLATIONS[language];

  // Derived current file
  const currentFile = files[activeFileId];

  // Handle Code Change
  const handleCodeChange = useCallback((newCode: string) => {
    setFiles(prev => ({
      ...prev,
      [activeFileId]: {
        ...prev[activeFileId],
        content: newCode
      }
    }));
  }, [activeFileId]);

  // Add New File
  const handleAddFile = (name: string, type: ConfigType) => {
    const newId = `file-${Date.now()}`;
    const newFile: FileConfig = {
      id: newId,
      type: type,
      name: name,
      content: FILE_TEMPLATES[type],
      description: type === ConfigType.NAMED_CONF ? 'Configuration file' : 'Zone file'
    };

    setFiles(prev => ({ ...prev, [newId]: newFile }));
    setActiveFileId(newId);
    setAnalysisResult(null); // Reset analysis when switching/creating
  };

  // Delete File
  const handleDeleteFile = (id: string) => {
    const newFiles = { ...files };
    delete newFiles[id];
    setFiles(newFiles);

    // If we deleted the active file, switch to the first available one
    if (activeFileId === id) {
      const remainingIds = Object.keys(newFiles);
      if (remainingIds.length > 0) {
        setActiveFileId(remainingIds[0]);
      }
    }
    setAnalysisResult(null);
  };

  // Handle Validation
  const handleValidate = async () => {
    if (!currentFile) return;
    setAnalysisResult({ type: 'validation', data: {} as any, isLoading: true });
    const result = await validateBindConfig(currentFile.content, currentFile.name, language);
    setAnalysisResult({ type: 'validation', data: result, isLoading: false });
  };

  // Handle Explanation
  const handleExplain = async () => {
    if (!currentFile) return;
    setAnalysisResult({ type: 'explanation', data: "", isLoading: true });
    const result = await explainBindConfig(currentFile.content, currentFile.name, language);
    setAnalysisResult({ type: 'explanation', data: result, isLoading: false });
  };

  // Get errors for the current file to pass to editor
  const currentErrors = (analysisResult?.type === 'validation' && !analysisResult.isLoading)
    ? (analysisResult.data as ValidationResult).errors
    : [];

  if (!currentFile) {
    return <div className="h-screen bg-slate-950 text-slate-400 flex items-center justify-center">{t.noFiles}</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200">
      <Header activeFile={currentFile} language={language} onLanguageChange={setLanguage} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: File Navigation */}
        <FileTabs 
          files={files} 
          activeFileId={activeFileId} 
          onFileChange={setActiveFileId}
          onAddFile={handleAddFile}
          onDeleteFile={handleDeleteFile}
          language={language}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Toolbar */}
          <div className="bg-slate-900/50 p-2 border-b border-slate-800 flex gap-2 items-center">
            <button
              onClick={handleValidate}
              disabled={analysisResult?.isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
               {t.checkSyntax}
            </button>
            <button
              onClick={handleExplain}
              disabled={analysisResult?.isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              {t.explainCode}
            </button>
            <div className="ml-auto text-xs text-slate-500 hidden xl:block">
              {t.changesSaved}
            </div>
          </div>

          {/* Split View: Editor & Console */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Editor Section */}
            <div className="flex-1 flex flex-col border-r border-slate-800 min-h-[50%]">
               <div className="bg-slate-900/80 px-4 py-1 text-xs text-slate-500 border-b border-slate-800 uppercase tracking-wider flex justify-between">
                  <span>{t.editor}</span>
                  <span>{currentFile.name}</span>
               </div>
               <CodeEditor 
                 code={currentFile.content} 
                 onChange={handleCodeChange} 
                 errors={currentErrors} 
               />
            </div>

            {/* Output Console Section */}
            <div className="lg:w-1/3 flex flex-col bg-slate-900 min-h-[30%] lg:min-h-full">
              <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 font-semibold border-b border-slate-700 uppercase tracking-wider shadow-sm z-10">
                {t.validationResults}
              </div>
              <div className="flex-1 overflow-hidden bg-slate-900">
                 <OutputConsole result={analysisResult} language={language} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
