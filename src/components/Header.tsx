import React from 'react';
import { Hammer, Play, Download, Settings, Zap } from 'lucide-react';

interface HeaderProps {
  onBuild: () => void;
  isBuilding: boolean;
  projectName: string;
  onDownload: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBuild, isBuilding, projectName, onDownload }) => {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">11tyWeb</h1>
          </div>
        </div>
        
        <div className="h-6 w-px bg-gray-300"></div>
        
        <div className="text-sm text-gray-600">
          <span className="font-medium">{projectName}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onBuild}
          disabled={isBuilding}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            isBuilding
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isBuilding ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
              Building...
            </>
          ) : (
            <>
              <Hammer className="w-4 h-4" />
              Build Site
            </>
          )}
        </button>
        
        <button
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
        >
          <Settings className="w-4 h-4" />
        </button>
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};