import React from 'react';
import { BuildResult } from '../types';
import { CheckCircle, XCircle, Terminal } from 'lucide-react';

interface BuildOutputProps {
  buildResult: BuildResult | null;
  isBuilding: boolean;
}

export const BuildOutput: React.FC<BuildOutputProps> = ({ buildResult, isBuilding }) => {
  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700">
        <Terminal className="w-4 h-4" />
        <span className="text-sm font-medium">Build Output</span>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
        {isBuilding && (
          <div className="flex items-center gap-2 text-yellow-400">
            <div className="animate-spin w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
            <span>Building...</span>
          </div>
        )}
        
        {buildResult && !isBuilding && (
          <div>
            <div className={`flex items-center gap-2 mb-2 ${buildResult.success ? 'text-green-400' : 'text-red-400'}`}>
              {buildResult.success ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span className="font-medium">
                {buildResult.success ? 'Build Successful' : 'Build Failed'}
              </span>
            </div>
            
            <pre className="whitespace-pre-wrap text-gray-300">
              {buildResult.success ? buildResult.output : buildResult.error}
            </pre>
          </div>
        )}
        
        {!buildResult && !isBuilding && (
          <div className="text-gray-500">
            <p>Ready to build. Click "Build Site" to generate your 11ty site.</p>
          </div>
        )}
      </div>
    </div>
  );
};