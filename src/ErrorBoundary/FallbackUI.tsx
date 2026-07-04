import React from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

interface FallbackUIProps {
  error?: Error;
  resetError?: () => void;
}

const FallbackUI: React.FC<FallbackUIProps> = ({ error, resetError }) => {
  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans text-gray-800">
      {/* Header matching the theme */}
      <header className="bg-[#481e69] text-white py-4 px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-lg">
            <AlertCircle size={22} className="text-purple-100" />
          </div>
          <div>
            <h1 className="font-bold text-xl leading-tight tracking-wide">System Alert</h1>
            <p className="text-xs text-purple-200 font-medium tracking-wider uppercase mt-0.5">Application Error Recovered</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-lg w-full">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="bg-red-50 text-red-500 p-4 rounded-full mb-5">
              <AlertCircle size={42} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              We encountered an unexpected error while rendering this page. 
              Our technical team has been notified of the issue.
            </p>
          </div>

          {error && (
            <div className="mb-8 bg-gray-50 rounded-lg p-4 border border-gray-100 overflow-x-auto shadow-inner">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Error details</p>
              <pre className="text-xs text-red-600 font-mono whitespace-pre-wrap break-words">
                {error.toString()}
              </pre>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => {
                if (resetError) resetError();
                else window.location.reload();
              }}
              className="flex items-center justify-center gap-2 bg-[#481e69] hover:bg-[#3a1854] text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              <RefreshCcw size={18} />
              Try Again
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Home size={18} />
              Return Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FallbackUI;
