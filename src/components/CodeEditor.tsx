'use client';

import React, { useState, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Save, 
  FolderOpen, 
  File, 
  Settings, 
  Moon, 
  Sun,
  Copy,
  Download,
  Upload,
  Search,
  Replace,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface FileTab {
  id: string;
  name: string;
  content: string;
  language: string;
  isModified: boolean;
}

const CodeEditor: React.FC = () => {
  const [files, setFiles] = useState<FileTab[]>([
    {
      id: '1',
      name: 'main.js',
      content: '// Welcome to the Code Editor\nconsole.log("Hello, World!");',
      language: 'javascript',
      isModified: false
    }
  ]);
  
  const [activeFileId, setActiveFileId] = useState<string>('1');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('off');
  
  const editorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeFile = files.find(f => f.id === activeFileId);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (!value || !activeFileId) return;
    
    setFiles(prev => prev.map(file => 
      file.id === activeFileId 
        ? { ...file, content: value, isModified: true }
        : file
    ));
  }, [activeFileId]);

  const createNewFile = () => {
    const newId = Date.now().toString();
    const newFile: FileTab = {
      id: newId,
      name: 'untitled.js',
      content: '',
      language: 'javascript',
      isModified: false
    };
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newId);
  };

  const closeFile = (fileId: string) => {
    setFiles(prev => {
      const newFiles = prev.filter(f => f.id !== fileId);
      if (fileId === activeFileId && newFiles.length > 0) {
        setActiveFileId(newFiles[0].id);
      }
      return newFiles;
    });
  };

  const saveFile = () => {
    if (!activeFile) return;
    
    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
    
    setFiles(prev => prev.map(file => 
      file.id === activeFileId 
        ? { ...file, isModified: false }
        : file
    ));
  };

  const openFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      const languageMap: Record<string, string> = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'html': 'html',
        'css': 'css',
        'json': 'json',
        'md': 'markdown',
        'xml': 'xml',
        'sql': 'sql',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'php': 'php',
        'rb': 'ruby',
        'go': 'go',
        'rs': 'rust',
        'sh': 'shell'
      };

      const newFile: FileTab = {
        id: Date.now().toString(),
        name: file.name,
        content,
        language: languageMap[extension || ''] || 'plaintext',
        isModified: false
      };
      
      setFiles(prev => [...prev, newFile]);
      setActiveFileId(newFile.id);
    };
    reader.readAsText(file);
  };

  const copyToClipboard = () => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content);
    }
  };

  const runCode = () => {
    if (!activeFile) return;
    
    if (activeFile.language === 'javascript') {
      try {
        // Create a new function to execute the code safely
        const func = new Function(activeFile.content);
        func();
      } catch (error) {
        console.error('Error executing code:', error);
      }
    }
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-2 border-b ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'
      }`}>
        <div className="flex items-center space-x-2">
          <button
            onClick={createNewFile}
            className={`p-2 rounded hover:bg-opacity-80 ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="New File"
          >
            <File size={18} />
          </button>
          <button
            onClick={openFile}
            className={`p-2 rounded hover:bg-opacity-80 ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="Open File"
          >
            <FolderOpen size={18} />
          </button>
          <button
            onClick={saveFile}
            className={`p-2 rounded hover:bg-opacity-80 ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="Save File"
          >
            <Save size={18} />
          </button>
          <button
            onClick={copyToClipboard}
            className={`p-2 rounded hover:bg-opacity-80 ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="Copy to Clipboard"
          >
            <Copy size={18} />
          </button>
          <button
            onClick={runCode}
            className={`p-2 rounded hover:bg-opacity-80 ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="Run Code"
          >
            <Play size={18} />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded hover:bg-opacity-80 ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded hover:bg-opacity-80 ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="Settings"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2 rounded hover:bg-opacity-80 ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* File Tabs */}
      <div className={`flex overflow-x-auto border-b ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'
      }`}>
        {files.map(file => (
          <div
            key={file.id}
            className={`flex items-center px-4 py-2 border-r cursor-pointer min-w-0 ${
              file.id === activeFileId
                ? theme === 'dark' ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'
                : theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
            }`}
            onClick={() => setActiveFileId(file.id)}
          >
            <span className="truncate text-sm">
              {file.name}
              {file.isModified && <span className="text-orange-500 ml-1">•</span>}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeFile(file.id);
              }}
              className="ml-2 hover:bg-red-500 hover:text-white rounded px-1"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`p-4 border-b ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'
        }`}>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <span className="text-sm">Font Size:</span>
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm w-8">{fontSize}</span>
            </label>
            <label className="flex items-center space-x-2">
              <span className="text-sm">Word Wrap:</span>
              <select
                value={wordWrap}
                onChange={(e) => setWordWrap(e.target.value as 'on' | 'off')}
                className={`px-2 py-1 rounded ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="off">Off</option>
                <option value="on">On</option>
              </select>
            </label>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1">
        {activeFile ? (
          <Editor
            height="100%"
            language={activeFile.language}
            value={activeFile.content}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              fontSize,
              wordWrap,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              renderWhitespace: 'selection',
              bracketPairColorization: { enabled: true },
              suggest: { enabled: true },
              quickSuggestions: true,
              folding: true,
              lineNumbers: 'on',
              rulers: [80, 120],
            }}
          />
        ) : (
          <div className={`flex items-center justify-center h-full ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <p>No file open. Create a new file or open an existing one.</p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept=".js,.jsx,.ts,.tsx,.py,.html,.css,.json,.md,.xml,.sql,.java,.cpp,.c,.php,.rb,.go,.rs,.sh,.txt"
      />
    </div>
  );
};

export default CodeEditor;