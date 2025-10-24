'use client';

import React, { useState, useCallback } from 'react';
import CodeEditor from './CodeEditor';
import FileExplorer from './FileExplorer';
import Terminal from './Terminal';
import SearchPanel from './SearchPanel';
import { Terminal as TerminalIcon, Layout, Search, GitBranch, Settings } from 'lucide-react';

interface FileTab {
  id: string;
  name: string;
  content: string;
  language: string;
  isModified: boolean;
}

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isExpanded?: boolean;
  content?: string;
}

const IDE: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showTerminal, setShowTerminal] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [files, setFiles] = useState<FileTab[]>([
    {
      id: '1',
      name: 'welcome.js',
      content: '// Welcome to the Code Editor IDE\n// This is a fully featured code editor with:\n// - Syntax highlighting\n// - File explorer\n// - Terminal\n// - Multiple language support\n\nconsole.log("Welcome to your new IDE!");',
      language: 'javascript',
      isModified: false
    }
  ]);
  const [activeFileId, setActiveFileId] = useState<string>('1');

  const handleFileSelect = useCallback((fileNode: FileNode) => {
    if (fileNode.type === 'file' && fileNode.content !== undefined) {
      // Check if file is already open
      const existingFile = files.find(f => f.name === fileNode.name);
      
      if (existingFile) {
        setActiveFileId(existingFile.id);
      } else {
        // Determine language from file extension
        const extension = fileNode.name.split('.').pop()?.toLowerCase();
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
          name: fileNode.name,
          content: fileNode.content,
          language: languageMap[extension || ''] || 'plaintext',
          isModified: false
        };

        setFiles(prev => [...prev, newFile]);
        setActiveFileId(newFile.id);
      }
    }
  }, [files]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`h-screen flex flex-col ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      {/* Top Menu Bar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'
      }`}>
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-bold">Code Editor IDE</h1>
          <div className="flex items-center space-x-2 text-sm">
            <span className={`px-2 py-1 rounded ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              File
            </span>
            <span className={`px-2 py-1 rounded ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              Edit
            </span>
            <span className={`px-2 py-1 rounded ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              View
            </span>
            <span className={`px-2 py-1 rounded ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              Run
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFileExplorer(!showFileExplorer)}
            className={`p-2 rounded hover:bg-opacity-80 ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            } ${showFileExplorer ? 'bg-blue-600 text-white' : ''}`}
            title="Toggle File Explorer"
          >
            <Layout size={18} />
          </button>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded hover:bg-opacity-80 ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            } ${showSearch ? 'bg-blue-600 text-white' : ''}`}
            title="Search"
          >
            <Search size={18} />
          </button>
          <button
            className={`p-2 rounded hover:bg-opacity-80 ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="Source Control"
          >
            <GitBranch size={18} />
          </button>
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`p-2 rounded hover:bg-opacity-80 ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            } ${showTerminal ? 'bg-blue-600 text-white' : ''}`}
            title="Toggle Terminal"
          >
            <TerminalIcon size={18} />
          </button>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded hover:bg-opacity-80 ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="Toggle Theme"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer Sidebar */}
        {showFileExplorer && (
          <FileExplorer 
            onFileSelect={handleFileSelect}
            theme={theme}
          />
        )}

        {/* Search Panel */}
        {showSearch && (
          <SearchPanel 
            theme={theme}
            isVisible={showSearch}
            onClose={() => setShowSearch(false)}
          />
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <CodeEditor />
          </div>
        </div>
      </div>

      {/* Terminal */}
      <Terminal 
        theme={theme}
        isVisible={showTerminal}
        onClose={() => setShowTerminal(false)}
      />

      {/* Status Bar */}
      <div className={`flex items-center justify-between px-4 py-1 text-sm border-t ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'
      }`}>
        <div className="flex items-center space-x-4">
          <span>Ready</span>
          <span>Line 1, Column 1</span>
          <span>JavaScript</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>UTF-8</span>
          <span>LF</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
};

export default IDE;