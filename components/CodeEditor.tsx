import React, { useState, useRef, useEffect } from 'react';
import { ValidationError } from '../types';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  errors: ValidationError[];
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, errors, readOnly = false }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Sync scrolling between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const lines = code.split('\n');
  
  // Helper to check if a line has an error
  const getErrorForLine = (lineNumber: number) => {
    return errors.find(err => err.line === lineNumber);
  };

  return (
    <div className="relative flex flex-1 h-full bg-slate-950 font-mono text-sm overflow-hidden group">
      {/* Line Numbers Gutter */}
      <div 
        ref={lineNumbersRef}
        className="w-12 bg-slate-900 border-r border-slate-800 text-right py-4 pr-3 text-slate-600 select-none overflow-hidden"
      >
        {lines.map((_, i) => {
          const lineNum = i + 1;
          const error = getErrorForLine(lineNum);
          return (
            <div 
              key={lineNum} 
              className={`leading-6 h-6 text-xs flex justify-end items-center ${error ? 'text-red-400 font-bold' : ''}`}
            >
               {error && <span className="mr-1 text-[10px]">●</span>}
               {lineNum}
            </div>
          );
        })}
      </div>

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        spellCheck={false}
        readOnly={readOnly}
        className="flex-1 bg-transparent text-slate-300 p-4 outline-none resize-none leading-6 whitespace-pre overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
        style={{ tabSize: 4 }}
      />
    </div>
  );
};