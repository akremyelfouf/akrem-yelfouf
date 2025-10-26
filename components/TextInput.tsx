import React from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';

interface TextInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  fileName: string | null;
  isLoading: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange, onFileChange, onClear, fileName, isLoading }) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-300">النص الأصلي</h2>
        <div className="flex items-center gap-2">
            <label htmlFor="file-upload" className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-gray-300 font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-colors duration-300">
                <UploadIcon className="w-5 h-5" />
                <span>رفع ملف</span>
            </label>
            <input id="file-upload" type="file" className="hidden" onChange={onFileChange} accept=".txt,.docx" disabled={isLoading} />
            {(value || fileName) && (
                <button onClick={onClear} className="bg-red-800/50 hover:bg-red-700/50 text-red-300 p-2 rounded-lg transition-colors duration-300" aria-label="Clear input">
                    <TrashIcon className="w-5 h-5" />
                </button>
            )}
        </div>
      </div>
       {fileName && (
        <div className="bg-slate-700/50 text-gray-300 text-sm py-2 px-3 rounded-md">
          <p>الملف المرفوع: <span className="font-medium">{fileName}</span></p>
        </div>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder="الصق بحثك هنا أو قم برفع ملف..."
        className="w-full h-96 bg-slate-900 text-gray-300 p-4 rounded-md border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 resize-y"
        disabled={isLoading}
      />
    </div>
  );
};

export default TextInput;