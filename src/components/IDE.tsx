'use client';

import React, { useState, useCallback, useEffect } from 'react';
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showMinimap, setShowMinimap] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);

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

  // Menu functions
  const handleNewFile = () => {
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
    setActiveDropdown(null);
  };

  const handleOpenFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.js,.jsx,.ts,.tsx,.py,.html,.css,.json,.md,.xml,.sql,.java,.cpp,.c,.php,.rb,.go,.rs,.sh,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          const extension = file.name.split('.').pop()?.toLowerCase();
          const languageMap: Record<string, string> = {
            'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
            'py': 'python', 'html': 'html', 'css': 'css', 'json': 'json', 'md': 'markdown'
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
      }
    };
    input.click();
    setActiveDropdown(null);
  };

  const handleSaveFile = () => {
    const activeFile = files.find(f => f.id === activeFileId);
    if (activeFile) {
      const blob = new Blob([activeFile.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeFile.name;
      a.click();
      URL.revokeObjectURL(url);
      setFiles(prev => prev.map(file => 
        file.id === activeFileId ? { ...file, isModified: false } : file
      ));
    }
    setActiveDropdown(null);
  };

  const handleCloseFile = () => {
    setFiles(prev => {
      const newFiles = prev.filter(f => f.id !== activeFileId);
      if (newFiles.length > 0) {
        setActiveFileId(newFiles[0].id);
      }
      return newFiles;
    });
    setActiveDropdown(null);
  };

  const handleRunCode = () => {
    const activeFile = files.find(f => f.id === activeFileId);
    if (activeFile && activeFile.language === 'javascript') {
      try {
        console.clear();
        console.log(`🚀 Running ${activeFile.name}...`);
        const func = new Function(activeFile.content);
        func();
        console.log('✅ Execution completed');
      } catch (error) {
        console.error('❌ Execution error:', error);
      }
    }
    setActiveDropdown(null);
  };

  const handleDropdownClick = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'
      }`}>
      {/* Top Menu Bar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${theme === 'dark' ? 'bg-black border-black' : 'bg-gray-100 border-gray-300'
        }`}>
        <div className="flex items-center space-x-4">
          <img
            src="/favicon.ico"
            alt="Zaptor Logo"
            className="w-12 h-12 ml-1"
          />
          <h1 className="text-lg font-bold">Zaptor</h1>
          <div className="flex items-center space-x-2 text-sm relative">
            {/* File Menu */}
            <div className="relative">
              <button
                onClick={() => handleDropdownClick('file')}
                className={`px-3 py-1 rounded hover:bg-opacity-80 ${
                  theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
                } ${activeDropdown === 'file' ? (theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300') : ''}`}
              >
                File
              </button>
              {activeDropdown === 'file' && (
                <div className={`absolute top-full left-0 mt-1 w-48 rounded shadow-lg border z-50 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                }`}>
                  <button onClick={handleNewFile} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    New File <span className="float-right text-xs opacity-60">Ctrl+N</span>
                  </button>
                  <button onClick={handleOpenFile} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    Open File <span className="float-right text-xs opacity-60">Ctrl+O</span>
                  </button>
                  <hr className={`my-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`} />
                  <button onClick={handleSaveFile} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    Save <span className="float-right text-xs opacity-60">Ctrl+S</span>
                  </button>
                  <button onClick={() => {}} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    Save As <span className="float-right text-xs opacity-60">Ctrl+Shift+S</span>
                  </button>
                  <hr className={`my-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`} />
                  <button onClick={handleCloseFile} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    Close File <span className="float-right text-xs opacity-60">Ctrl+W</span>
                  </button>
                </div>
              )}
            </div>

            {/* Edit Menu */}
            <div className="relative">
              <button
                onClick={() => handleDropdownClick('edit')}
                className={`px-3 py-1 rounded hover:bg-opacity-80 ${
                  theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
                } ${activeDropdown === 'edit' ? (theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300') : ''}`}
              >
                Edit
              </button>
              {activeDropdown === 'edit' && (
                <div className={`absolute top-full left-0 mt-1 w-48 rounded shadow-lg border z-50 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                }`}>
                  <button onClick={() => {document.execCommand('undo'); setActiveDropdown(null);}} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    Undo <span className="float-right text-xs opacity-60">Ctrl+Z</span>
                  </button>
                  <button onClick={() => {document.execCommand('redo'); setActiveDropdown(null);}} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    Redo <span className="float-right text-xs opacity-60">Ctrl+Y</span>
                  </button>
                  <hr className={`my-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`} />
                  <button onClick={() => {document.execCommand('cut'); setActiveDropdown(null);}} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    Cut <span className="float-right text-xs opacity-60">Ctrl+X</span>
                  </button>
                  <button onClick={() => {document.execCommand('copy'); setActiveDropdown(null);}} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    Copy <span className="float-right text-xs opacity-60">Ctrl+C</span>
                  </button>
                  <button onClick={() => {document.execCommand('paste'); setActiveDropdown(null);}} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    Paste <span className="float-right text-xs opacity-60">Ctrl+V</span>
                  </button>
                  <hr className={`my-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`} />
                  <button onClick={() => {setShowSearch(true); setActiveDropdown(null);}} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    Find <span className="float-right text-xs opacity-60">Ctrl+F</span>
                  </button>
                  <button onClick={() => {setShowSearch(true); setActiveDropdown(null);}} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    Replace <span className="float-right text-xs opacity-60">Ctrl+H</span>
                  </button>
                </div>
              )}
            </div>

            {/* View Menu */}
            <div className="relative">
              <button
                onClick={() => handleDropdownClick('view')}
                className={`px-3 py-1 rounded hover:bg-opacity-80 ${
                  theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
                } ${activeDropdown === 'view' ? (theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300') : ''}`}
              >
                View
              </button>
              {activeDropdown === 'view' && (
                <div className={`absolute top-full left-0 mt-1 w-48 rounded shadow-lg border z-50 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                }`}>
                  <button onClick={() => {setShowFileExplorer(!showFileExplorer); setActiveDropdown(null);}} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    {showFileExplorer ? '✓' : '  '} File Explorer
                  </button>
                  <button onClick={() => {setShowSearch(!showSearch); setActiveDropdown(null);}} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    {showSearch ? '✓' : '  '} Search Panel
                  </button>
                  <button onClick={() => {setShowTerminal(!showTerminal); setActiveDropdown(null);}} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    {showTerminal ? '✓' : '  '} Terminal
                  </button>
                  <hr className={`my-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`} />
                  <button onClick={() => {setShowMinimap(!showMinimap); setActiveDropdown(null);}} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    {showMinimap ? '✓' : '  '} Minimap
                  </button>
                  <button onClick={() => {setShowLineNumbers(!showLineNumbers); setActiveDropdown(null);}} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    {showLineNumbers ? '✓' : '  '} Line Numbers
                  </button>
                  <button onClick={() => {setWordWrap(!wordWrap); setActiveDropdown(null);}} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    {wordWrap ? '✓' : '  '} Word Wrap
                  </button>
                  <hr className={`my-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`} />
                  <button onClick={() => {toggleTheme(); setActiveDropdown(null);}} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    Toggle Theme
                  </button>
                </div>
              )}
            </div>

            {/* Run Menu */}
            <div className="relative">
              <button
                onClick={() => handleDropdownClick('run')}
                className={`px-3 py-1 rounded hover:bg-opacity-80 ${
                  theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
                } ${activeDropdown === 'run' ? (theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300') : ''}`}
              >
                Run
              </button>
              {activeDropdown === 'run' && (
                <div className={`absolute top-full left-0 mt-1 w-48 rounded shadow-lg border z-50 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                }`}>
                  <button onClick={handleRunCode} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    Run Code <span className="float-right text-xs opacity-60">F5</span>
                  </button>
                  <button onClick={() => {console.clear(); setActiveDropdown(null);}} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    Clear Console
                  </button>
                  <hr className={`my-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`} />
                  <button onClick={() => {setShowTerminal(true); setActiveDropdown(null);}} className={`w-full text-left px-3 py-2 hover:bg-opacity-80 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    Open Terminal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFileExplorer(!showFileExplorer)}
            className={`p-2 rounded hover:bg-opacity-80 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              } ${showFileExplorer ? 'bg-blue-600 text-white' : ''}`}
            title="Toggle File Explorer"
          >
            <Layout size={18} />
          </button>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded hover:bg-opacity-80 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              } ${showSearch ? 'bg-blue-600 text-white' : ''}`}
            title="Search"
          >
            <Search size={18} />
          </button>
          <button
            className={`p-2 rounded hover:bg-opacity-80 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            title="Source Control"
          >
            <GitBranch size={18} />
          </button>
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`p-2 rounded hover:bg-opacity-80 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              } ${showTerminal ? 'bg-blue-600 text-white' : ''}`}
            title="Toggle Terminal"
          >
            <TerminalIcon size={18} />
          </button>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded hover:bg-opacity-80 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            title="Toggle Theme"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex flex-1 overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
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
        <div className={`flex-1 flex flex-col ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
          <div className={`flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
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
      <div className={`flex items-center justify-between px-4 py-1 text-sm border-t ${theme === 'dark' ? 'bg-black border-black' : 'bg-gray-100 border-gray-300'
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