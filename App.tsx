
import React, { useState, useCallback, useEffect } from 'react';
import { generateFormula } from './services/geminiService';
import type { FormulaResponse } from './types';
import { FormulaIcon, LightbulbIcon, SparklesIcon, CopyIcon, CheckIcon, AlertTriangleIcon, KeyIcon } from './components/Icons';
import LoadingSkeleton from './components/LoadingSkeleton';
import { ApiKeyModal } from './components/ApiKeyModal';

const examplePrompts = [
  "Sum values in column A if column B is 'Sales'",
  "Find the average of cells A1 to A10, but only include numbers greater than 50",
  "Combine text from cell A2 and B2 with a space in between",
  "If cell C5 is greater than 100, show 'High', otherwise show 'Low'",
];

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [result, setResult] = useState<FormulaResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setShowApiKeyModal(true);
    }
  }, []);
  
  const handleSaveApiKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    setShowApiKeyModal(false);
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setIsCopied(false);

    try {
      const generatedResult = await generateFormula(prompt);
      setResult(generatedResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      if (errorMessage.toLowerCase().includes('api key')) {
        setTimeout(() => setShowApiKeyModal(true), 500);
      }
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  const handleCopy = () => {
    if (result?.formula) {
      navigator.clipboard.writeText(result.formula);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    setResult(null);
    setError(null);
  };

  if (!apiKey || showApiKeyModal) {
    return <ApiKeyModal onSave={handleSaveApiKey} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center mb-8 mt-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FormulaIcon className="w-10 h-10 text-green-400" />
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-400 to-teal-400 text-transparent bg-clip-text">
              Excel Formula Generator
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Describe your task, and let AI generate the perfect formula for you.
          </p>
        </header>

        <main>
          <div className="bg-gray-800/50 rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-gray-700">
            <label htmlFor="prompt-input" className="block text-lg font-medium text-gray-300 mb-2">
              What do you want to achieve?
            </label>
            <textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Sum all sales from the 'West' region in column C"
              className="w-full h-28 p-4 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200 resize-none text-base"
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 text-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-6 h-6" />
                  Generate Formula
                </>
              )}
            </button>
          </div>

          {!isLoading && (
            <div className="mt-6">
              <h3 className="text-md font-semibold text-gray-400 flex items-center gap-2 mb-3">
                <LightbulbIcon className="w-5 h-5 text-yellow-400" />
                Not sure where to start? Try an example:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="text-left text-sm text-gray-300 bg-gray-800/60 p-3 rounded-lg hover:bg-gray-700/80 transition-colors duration-200 border border-gray-700"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {isLoading && <LoadingSkeleton />}

          {!isLoading && error && (
            <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3">
                <AlertTriangleIcon className="w-6 h-6"/>
                <div>
                    <p className="font-bold">An error occurred</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
          )}

          {!isLoading && result && !error && (
            <div className="mt-8 bg-gray-800/50 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-700 overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">Generated Formula</h2>
                <div className="relative bg-black rounded-lg p-4 font-mono text-lg text-green-400 border border-gray-600">
                  <code>{result.formula}</code>
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                    aria-label="Copy formula"
                  >
                    {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5 text-gray-300" />}
                  </button>
                </div>
              </div>
              <div className="bg-gray-900/50 px-6 py-5 border-t border-gray-700">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Explanation</h3>
                <div className="prose prose-invert prose-p:text-gray-300 prose-ul:text-gray-300 prose-li:marker:text-green-400">
                   {result.explanation.split('\n').map((line, i) => {
                       if (line.trim().startsWith('- ')) {
                           return <p key={i} className="ml-4">{line}</p>
                       }
                       return <p key={i}>{line}</p>
                   })}
                </div>
              </div>
            </div>
          )}
        </main>
        <footer className="text-center mt-8 pb-4">
          <button 
            onClick={() => setShowApiKeyModal(true)}
            className="text-gray-500 hover:text-gray-400 text-sm flex items-center gap-2 mx-auto transition-colors"
            aria-label="Change API Key"
          >
            <KeyIcon className="w-4 h-4" />
            Change API Key
          </button>
        </footer>
      </div>
    </div>
  );
};

export default App;
