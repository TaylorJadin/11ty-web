import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { getFileExtension, getLanguageFromExtension } from '../utils/fileSystem';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  fileName?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  language,
  fileName 
}) => {
  const editorRef = useRef<any>(null);
  
  const detectedLanguage = fileName 
    ? getLanguageFromExtension(getFileExtension(fileName))
    : language || 'plaintext';

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div className="h-full">
      <Editor
        height="100%"
        language={detectedLanguage}
        value={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: 'on',
          lineHeight: 22,
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        }}
      />
    </div>
  );
};