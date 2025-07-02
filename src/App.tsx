import React, { useState, useCallback } from 'react';
import { FileNode, BuildResult } from './types';
import { createDefaultProject, findFileById, updateFileContent } from './utils/fileSystem';
import { buildEleventyProject } from './utils/eleventyBuilder';
import { Header } from './components/Header';
import { FileTree } from './components/FileTree';
import { CodeEditor } from './components/CodeEditor';
import { PreviewPane } from './components/PreviewPane';
import { BuildOutput } from './components/BuildOutput';

function App() {
  const [files, setFiles] = useState<FileNode[]>(() => createDefaultProject());
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [buildResult, setBuildResult] = useState<BuildResult | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleFileSelect = useCallback((file: FileNode) => {
    setSelectedFile(file);
  }, []);

  const handleToggleFolder = useCallback((folderId: string) => {
    const toggleFolderRecursive = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === folderId && node.type === 'folder') {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children) {
          return { ...node, children: toggleFolderRecursive(node.children) };
        }
        return node;
      });
    };
    
    setFiles(toggleFolderRecursive(files));
  }, [files]);

  const handleEditorChange = useCallback((content: string) => {
    if (selectedFile) {
      setFiles(currentFiles => updateFileContent(currentFiles, selectedFile.id, content));
      setSelectedFile(prev => prev ? { ...prev, content } : null);
    }
  }, [selectedFile]);

  const handleBuild = useCallback(async () => {
    setIsBuilding(true);
    setShowOutput(true);
    
    try {
      const result = await buildEleventyProject(files);
      setBuildResult(result);
    } catch (error) {
      setBuildResult({
        success: false,
        error: `Build failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        files: []
      });
    } finally {
      setIsBuilding(false);
    }
  }, [files]);

  // Auto-select first file on initial load
  React.useEffect(() => {
    if (!selectedFile && files.length > 0) {
      const firstFile = findFileById(files, 'index-md');
      if (firstFile) {
        setSelectedFile(firstFile);
      }
    }
  }, [files, selectedFile]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header 
        onBuild={handleBuild}
        isBuilding={isBuilding}
        projectName="My 11ty Site"
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - File Tree */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-gray-700">Files</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <FileTree
              files={files}
              selectedFileId={selectedFile?.id || null}
              onFileSelect={handleFileSelect}
              onToggleFolder={handleToggleFolder}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor */}
          <div className="flex-1 flex flex-col">
            {selectedFile ? (
              <>
                <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-4">
                  <span className="text-sm text-gray-600">{selectedFile.path}</span>
                </div>
                <div className="flex-1">
                  <CodeEditor
                    value={selectedFile.content || ''}
                    onChange={handleEditorChange}
                    fileName={selectedFile.name}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No File Selected</h3>
                  <p>Select a file from the sidebar to start editing</p>
                </div>
              </div>
            )}
          </div>

          {/* Output Panel (when visible) */}
          {showOutput && (
            <div className="h-48 border-t border-gray-200">
              <BuildOutput 
                buildResult={buildResult}
                isBuilding={isBuilding}
              />
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="w-96 border-l border-gray-200 bg-white">
          <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center justify-between px-4">
            <span className="text-sm font-medium text-gray-700">Preview</span>
            <button
              onClick={() => setShowOutput(!showOutput)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {showOutput ? 'Hide Output' : 'Show Output'}
            </button>
          </div>
          <div className="h-[calc(100%-2rem)]">
            <PreviewPane 
              buildResult={buildResult}
              isBuilding={isBuilding}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;