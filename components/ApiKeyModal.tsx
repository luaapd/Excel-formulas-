
import React, { useState } from 'react';

interface ApiKeyModalProps {
  onSave: (apiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
  const [key, setKey] = useState('');

  const handleSave = () => {
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 transform transition-all animate-fade-in-up">
        <h2 className="text-2xl font-bold text-white mb-2">Enter API Key</h2>
        <p className="text-gray-400 mb-4">
          Please provide your Google Gemini API key to continue. Your key is stored locally in your browser.
        </p>
        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 text-sm transition-colors duration-200 inline-block">
          Get your API key from Google AI Studio &rarr;
        </a>
        <div className="mt-6">
          <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-300 mb-1">
            Gemini API Key
          </label>
          <input
            id="api-key-input"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your API key here"
            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200"
            autoFocus
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
           <button
            onClick={handleSave}
            disabled={!key.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 shadow-md hover:shadow-lg"
          >
            Save & Continue
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
