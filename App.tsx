import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import TextInput from './components/TextInput';
import SummaryOutput from './components/SummaryOutput';
import { summarizeText } from './services/geminiService';
import { readFileContent } from './utils/fileReader';
import { SparklesIcon } from './components/icons/SparklesIcon';

// Add Mammoth to the window object for TypeScript
declare global {
  interface Window {
    mammoth: any;
  }
}

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [summaryLength, setSummaryLength] = useState<string>('متوسط');

  const summaryLengths = ['قصير جداً', 'قصير', 'متوسط', 'طويل', 'طويل جداً'];

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setError(null);
      setSummary('');
      setInputText('');
      setFileName(file.name);
      try {
        const content = await readFileContent(file);
        setInputText(content);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'فشل في قراءة الملف');
        setInputText('');
        setFileName(null);
      } finally {
        setIsLoading(false);
        // Clear the file input value to allow selecting the same file again
        event.target.value = '';
      }
    }
  }, []);

  const handleClear = useCallback(() => {
    setInputText('');
    setSummary('');
    setError(null);
    setFileName(null);
  }, []);

  const handleSummarize = useCallback(async () => {
    if (!inputText.trim()) {
      setError('الرجاء إدخال نص أو رفع ملف لتلخيصه.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSummary('');

    try {
      const result = await summarizeText(inputText, summaryLength);
      setSummary(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع.';
      setError(`فشل في إنشاء الملخص: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, summaryLength]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-4">
            <TextInput
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onFileChange={handleFileChange}
              onClear={handleClear}
              fileName={fileName}
              isLoading={isLoading}
            />
            <div className="flex flex-col gap-3 bg-slate-800 p-4 rounded-lg shadow-lg">
              <label className="text-gray-400 font-medium">حجم الملخص:</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {summaryLengths.map(len => (
                  <button
                    key={len}
                    onClick={() => setSummaryLength(len)}
                    disabled={isLoading}
                    className={`px-2 py-2 text-sm rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 ${
                      summaryLength === len
                        ? 'bg-indigo-600 text-white font-semibold shadow'
                        : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleSummarize}
              disabled={isLoading || !inputText.trim()}
              className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800/50 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-indigo-950/50"
            >
              {isLoading ? 'جارِ التلخيص...' : 'لخص النص'}
              {!isLoading && <SparklesIcon className="w-5 h-5" />}
            </button>
          </div>
          <SummaryOutput summary={summary} isLoading={isLoading} error={error} onResummarize={handleSummarize} />
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>تم التطوير من طرف أكرم يلفوف</p>
      </footer>
    </div>
  );
};

export default App;