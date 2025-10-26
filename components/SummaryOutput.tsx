import React, { useState, useEffect } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { RefreshIcon } from './icons/RefreshIcon';

interface SummaryOutputProps {
  summary: string;
  isLoading: boolean;
  error: string | null;
  onResummarize: () => void;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-4 bg-slate-700 rounded w-1/4"></div>
    <div className="h-3 bg-slate-700 rounded w-full"></div>
    <div className="h-3 bg-slate-700 rounded w-5/6"></div>
    <div className="h-3 bg-slate-700 rounded w-full"></div>
    <div className="h-4 bg-slate-700 rounded w-1/3 mt-6"></div>
    <div className="h-3 bg-slate-700 rounded w-full"></div>
    <div className="h-3 bg-slate-700 rounded w-4/6"></div>
  </div>
);

const SummaryOutput: React.FC<SummaryOutputProps> = ({ summary, isLoading, error, onResummarize }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg relative h-[31rem] lg:h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-300">الملخص</h2>
        {summary && (
          <div className="flex items-center gap-2">
            <button
                onClick={onResummarize}
                disabled={isLoading}
                className="bg-slate-700 hover:bg-slate-600 text-gray-300 font-bold py-2 px-3 rounded-lg inline-flex items-center gap-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="إعادة التلخيص"
            >
              <RefreshIcon className="w-5 h-5" />
              <span>إعادة التلخيص</span>
            </button>
            <button onClick={handleCopy} className="bg-slate-700 hover:bg-slate-600 text-gray-300 font-bold py-2 px-3 rounded-lg inline-flex items-center gap-2 transition-colors duration-300">
              {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
            </button>
          </div>
        )}
      </div>
      <div className="absolute inset-4 top-16 bottom-4 overflow-y-auto pr-2">
        {isLoading && <LoadingSkeleton />}
        {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}
        {!isLoading && !error && summary && (
          <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">{summary}</div>
        )}
        {!isLoading && !error && !summary && (
          <div className="text-gray-500 flex items-center justify-center h-full">
            <p>سيظهر الملخص الخاص بك هنا.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryOutput;