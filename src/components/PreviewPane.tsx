import React, { useEffect, useState } from 'react';
import { BuildResult } from '../types';
import { Monitor, Smartphone, Tablet, RotateCcw, ExternalLink } from 'lucide-react';

interface PreviewPaneProps {
  buildResult: BuildResult | null;
  isBuilding: boolean;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export const PreviewPane: React.FC<PreviewPaneProps> = ({ buildResult, isBuilding }) => {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [currentPage, setCurrentPage] = useState<string>('');
  const [previewContent, setPreviewContent] = useState<string>('');

  useEffect(() => {
    if (buildResult?.success && buildResult.files.length > 0) {
      // Find index.html or the first HTML file
      const indexFile = buildResult.files.find(f => f.outputPath.includes('index.html')) || buildResult.files[0];
      if (indexFile) {
        setCurrentPage(indexFile.outputPath);
        setPreviewContent(indexFile.content);
      }
    }
  }, [buildResult]);

  const getViewportDimensions = () => {
    switch (viewport) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const refreshPreview = () => {
    // Force re-render by updating content
    if (buildResult?.success && buildResult.files.length > 0) {
      const currentFile = buildResult.files.find(f => f.outputPath === currentPage);
      if (currentFile) {
        setPreviewContent(currentFile.content + '');
      }
    }
  };

  if (isBuilding) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Building your site...</p>
        </div>
      </div>
    );
  }

  if (!buildResult) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <Monitor className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No Preview Available</h3>
          <p>Build your project to see the preview</p>
        </div>
      </div>
    );
  }

  if (!buildResult.success) {
    return (
      <div className="h-full flex items-center justify-center bg-red-50">
        <div className="text-center text-red-600 max-w-md">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-medium mb-2">Build Failed</h3>
          <p className="text-sm whitespace-pre-line">{buildResult.error}</p>
        </div>
      </div>
    );
  }

  const dimensions = getViewportDimensions();

  return (
    <div className="h-full flex flex-col">
      {/* Preview Controls */}
      <div className="flex items-center justify-between p-3 border-b bg-white">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-2 rounded ${viewport === 'desktop' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-2 rounded ${viewport === 'tablet' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Tablet View"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-2 rounded ${viewport === 'mobile' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {buildResult.files.length > 1 && (
            <select
              value={currentPage}
              onChange={(e) => {
                const file = buildResult.files.find(f => f.outputPath === e.target.value);
                if (file) {
                  setCurrentPage(e.target.value);
                  setPreviewContent(file.content);
                }
              }}
              className="text-sm border rounded px-2 py-1"
            >
              {buildResult.files.map((file) => (
                <option key={file.outputPath} value={file.outputPath}>
                  {file.outputPath.replace('_site/', '')}
                </option>
              ))}
            </select>
          )}
          
          <button
            onClick={refreshPreview}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            title="Refresh Preview"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-4">
        <div
          className="bg-white shadow-lg overflow-auto"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: viewport !== 'desktop' ? '12px' : '4px',
          }}
        >
          <iframe
            srcDoc={previewContent}
            className="w-full h-full border-0"
            title="Preview"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
};