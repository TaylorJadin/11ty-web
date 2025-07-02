import React from 'react';
import { FileNode } from '../types';
import { 
  File, 
  Folder, 
  FolderOpen, 
  FileText, 
  Settings,
  Package
} from 'lucide-react';

interface FileTreeProps {
  files: FileNode[];
  selectedFileId: string | null;
  onFileSelect: (file: FileNode) => void;
  onToggleFolder: (folderId: string) => void;
  level?: number;
}

const getFileIcon = (fileName: string, type: 'file' | 'folder') => {
  if (type === 'folder') {
    return <Folder className="w-4 h-4 text-blue-500" />;
  }
  
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'js':
      return <FileText className="w-4 h-4 text-yellow-500" />;
    case 'json':
      return <Settings className="w-4 h-4 text-orange-500" />;
    case 'md':
      return <FileText className="w-4 h-4 text-blue-400" />;
    case 'html':
    case 'njk':
      return <FileText className="w-4 h-4 text-red-500" />;
    case 'css':
      return <FileText className="w-4 h-4 text-purple-500" />;
    default:
      return <File className="w-4 h-4 text-gray-500" />;
  }
};

export const FileTree: React.FC<FileTreeProps> = ({ 
  files, 
  selectedFileId, 
  onFileSelect, 
  onToggleFolder,
  level = 0 
}) => {
  return (
    <div className="select-none">
      {files.map((file) => (
        <div key={file.id}>
          <div
            className={`flex items-center gap-2 px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 ${
              selectedFileId === file.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
            }`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => {
              if (file.type === 'folder') {
                onToggleFolder(file.id);
              } else {
                onFileSelect(file);
              }
            }}
          >
            {file.type === 'folder' ? (
              file.isOpen ? (
                <FolderOpen className="w-4 h-4 text-blue-500" />
              ) : (
                <Folder className="w-4 h-4 text-blue-500" />
              )
            ) : (
              getFileIcon(file.name, file.type)
            )}
            <span className="truncate">{file.name}</span>
          </div>
          
          {file.type === 'folder' && file.isOpen && file.children && (
            <FileTree
              files={file.children}
              selectedFileId={selectedFileId}
              onFileSelect={onFileSelect}
              onToggleFolder={onToggleFolder}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  );
};