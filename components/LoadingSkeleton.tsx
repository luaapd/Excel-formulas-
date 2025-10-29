
import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="mt-8 bg-gray-800/50 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-700 overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="h-7 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="relative bg-black rounded-lg p-4 h-14 border border-gray-600">
           <div className="h-6 bg-gray-600 rounded w-3/4"></div>
        </div>
      </div>
      <div className="bg-gray-900/50 px-6 py-5 border-t border-gray-700">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
