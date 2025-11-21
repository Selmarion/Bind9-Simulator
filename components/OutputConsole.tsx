import React from 'react';
import { AnalysisResult, ValidationResult, Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface OutputConsoleProps {
  result: AnalysisResult | null;
  language: Language;
}

export const OutputConsole: React.FC<OutputConsoleProps> = ({ result, language }) => {
  const t = TRANSLATIONS[language];

  if (!result) {
    return (
      <div className="h-full flex items-center justify-center text-slate-600">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>{t.placeholderEmpty}</p>
        </div>
      </div>
    );
  }

  if (result.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm animate-pulse">{t.loading}</p>
        </div>
      </div>
    );
  }

  const renderValidation = (data: ValidationResult) => {
    return (
      <div className="space-y-4">
        <div className={`p-3 rounded-md border ${data.isValid ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
          <div className="flex items-center gap-2 font-bold text-sm">
             {data.isValid ? (
                 <><span className="text-xl">✓</span> {t.validConfig}</>
             ) : (
                 <><span className="text-xl">⚠</span> {t.invalidConfig}</>
             )}
          </div>
          <p className="mt-1 text-sm text-slate-300">{data.generalFeedback}</p>
        </div>

        {data.errors.length > 0 && (
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold mb-2">{t.errorDetails}</h3>
            <ul className="space-y-2">
              {data.errors.map((err, idx) => (
                <li key={idx} className="bg-slate-800/50 p-2 rounded border-l-2 border-red-500 text-sm">
                  <span className="text-slate-500 font-mono text-xs mr-2">{t.line} {err.line}:</span>
                  <span className="text-slate-300">{err.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      {result.type === 'validation' ? (
        renderValidation(result.data as ValidationResult)
      ) : (
        <div className="prose prose-invert prose-sm max-w-none">
           <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-md mb-4">
              <h3 className="text-indigo-400 font-bold m-0">{t.aiExplanation}</h3>
           </div>
           <div className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed">
             {result.data as string}
           </div>
        </div>
      )}
    </div>
  );
};
