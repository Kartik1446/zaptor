'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Minus, Square } from 'lucide-react';

interface TerminalProps {
  theme: 'light' | 'dark';
  isVisible: boolean;
  onClose: () => void;
}

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

const Terminal: React.FC<TerminalProps> = ({ theme, isVisible, onClose }) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'output',
      content: 'Welcome to Zapterminal ghost',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'output',
      content: 'Type "help" for available commands',
      timestamp: new Date()
    }
  ]);

  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentDirectory, setCurrentDirectory] = useState('/workspace');
  const [terminalHeight, setTerminalHeight] = useState(320); // 320px = h-80
  const [isResizing, setIsResizing] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const windowHeight = window.innerHeight;
      const newHeight = windowHeight - e.clientY;
      const minHeight = 150; // Increased minimum height
      const maxHeight = windowHeight * 0.8;

      setTerminalHeight(Math.max(minHeight, Math.min(maxHeight, newHeight)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      document.body.classList.remove('terminal-resizing');
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
      document.body.classList.add('terminal-resizing');
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const addLine = (content: string, type: 'input' | 'output' | 'error' = 'output') => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setLines(prev => [...prev, newLine]);
  };

  const executeCommand = (command: string) => {
    // Add input to terminal
    addLine(`${currentDirectory}$ ${command}`, 'input');

    // Add to history
    if (command.trim()) {
      setCommandHistory(prev => [...prev, command]);
    }

    const cmd = command.trim().toLowerCase();
    const args = cmd.split(' ');
    const baseCmd = args[0];

    switch (baseCmd) {
      case 'help':
        addLine('Available commands:');
        addLine('  help          - Show this help message');
        addLine('  clear         - Clear terminal');
        addLine('  ls            - List directory contents');
        addLine('  pwd           - Print working directory');
        addLine('  cd <dir>      - Change directory');
        addLine('  mkdir <dir>   - Create directory');
        addLine('  touch <file>  - Create file');
        addLine('  cat <file>    - Display file contents');
        addLine('  echo <text>   - Display text');
        addLine('  date          - Show current date and time');
        addLine('  whoami        - Show current user');
        addLine('  node <file>   - Run JavaScript file');
        addLine('  python <file> - Run Python file');
        break;

      case 'clear':
        setLines([]);
        break;

      case 'ls':
        addLine('src/');
        addLine('components/');
        addLine('utils/');
        addLine('package.json');
        addLine('README.md');
        addLine('tsconfig.json');
        break;

      case 'pwd':
        addLine(currentDirectory);
        break;

      case 'cd':
        if (args[1]) {
          if (args[1] === '..') {
            const parts = currentDirectory.split('/');
            parts.pop();
            setCurrentDirectory(parts.join('/') || '/');
          } else if (args[1] === '/') {
            setCurrentDirectory('/');
          } else {
            setCurrentDirectory(`${currentDirectory}/${args[1]}`);
          }
          addLine(`Changed directory to ${currentDirectory}`);
        } else {
          addLine('Usage: cd <directory>');
        }
        break;

      case 'mkdir':
        if (args[1]) {
          addLine(`Directory '${args[1]}' created`);
        } else {
          addLine('Usage: mkdir <directory_name>');
        }
        break;

      case 'touch':
        if (args[1]) {
          addLine(`File '${args[1]}' created`);
        } else {
          addLine('Usage: touch <filename>');
        }
        break;

      case 'cat':
        if (args[1]) {
          addLine(`Contents of ${args[1]}:`);
          addLine('// Sample file content');
          addLine('console.log("Hello, World!");');
        } else {
          addLine('Usage: cat <filename>');
        }
        break;

      case 'echo':
        const text = command.substring(5);
        addLine(text || '');
        break;

      case 'date':
        addLine(new Date().toString());
        break;

      case 'whoami':
        addLine('developer');
        break;

      case 'node':
        if (args[1]) {
          addLine(`Running ${args[1]}...`);
          addLine('Hello, World!');
          addLine(`Process finished with exit code 0`);
        } else {
          addLine('Usage: node <filename.js>');
        }
        break;

      case 'python':
        if (args[1]) {
          addLine(`Running ${args[1]}...`);
          addLine('Hello, World!');
          addLine(`Process finished with exit code 0`);
        } else {
          addLine('Usage: python <filename.py>');
        }
        break;

      case 'npm':
        if (args[1] === 'install') {
          addLine('Installing dependencies...');
          setTimeout(() => {
            addLine('Dependencies installed successfully!');
          }, 1000);
        } else if (args[1] === 'start') {
          addLine('Starting development server...');
          addLine('Server running on http://localhost:3000');
        } else {
          addLine('npm command executed');
        }
        break;

      case 'git':
        if (args[1] === 'status') {
          addLine('On branch main');
          addLine('Your branch is up to date with \'origin/main\'.');
          addLine('nothing to commit, working tree clean');
        } else if (args[1] === 'add') {
          addLine('Files staged for commit');
        } else if (args[1] === 'commit') {
          addLine('Changes committed successfully');
        } else {
          addLine('Git command executed');
        }
        break;

      case '':
        // Empty command, do nothing
        break;

      default:
        addLine(`Command not found: ${baseCmd}`, 'error');
        addLine('Type "help" for available commands');
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setCurrentInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion for common commands
      const commands = ['help', 'clear', 'ls', 'pwd', 'cd', 'mkdir', 'touch', 'cat', 'echo', 'date', 'whoami', 'node', 'python', 'npm', 'git'];
      const matches = commands.filter(cmd => cmd.startsWith(currentInput));
      if (matches.length === 1) {
        setCurrentInput(matches[0] + ' ');
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`border-t flex flex-col ${theme === 'dark' ? 'bg-black border-gray-700' : 'bg-white border-gray-300'
        }`}
      style={{ height: `${terminalHeight}px` }}
    >
      {/* Resize Handle */}
      <div
        ref={resizeRef}
        onMouseDown={handleResizeStart}
        className={`h-1 cursor-ns-resize terminal-resize-handle transition-colors ${theme === 'dark' ? 'bg-gray-600 hover:bg-blue-400' : 'bg-gray-300 hover:bg-blue-500'
          } ${isResizing ? 'bg-blue-500' : ''}`}
        title="Drag to resize terminal"
      />

      {/* Terminal Header */}
      <div className={`flex items-center justify-between px-3 py-2 border-b ${theme === 'dark' ? 'bg-black border-gray-700' : 'bg-gray-100 border-gray-300'
        }`}>
        <div className="flex items-center space-x-2">
          <TerminalIcon size={16} />
          <span className="text-sm font-medium">Terminal</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            className={`p-1 rounded hover:bg-opacity-80 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
          >
            <Minus size={14} />
          </button>
          <button
            className={`p-1 rounded hover:bg-opacity-80 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
          >
            <Square size={14} />
          </button>
          <button
            onClick={onClose}
            className={`p-1 rounded hover:bg-red-500 hover:text-white ${theme === 'dark' ? 'hover:bg-red-600' : 'hover:bg-red-500'
              }`}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className={`flex-1 p-3 overflow-y-auto font-mono text-sm ${theme === 'dark' ? 'bg-black text-green-400' : 'bg-gray-50 text-gray-800'
          }`}
      >
        {lines.map(line => (
          <div
            key={line.id}
            className={`mb-1 ${line.type === 'error'
              ? 'text-red-400'
              : line.type === 'input'
                ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                : theme === 'dark' ? 'text-green-400' : 'text-gray-700'
              }`}
          >
            {line.content}
          </div>
        ))}

        {/* Input Line */}
        <div className={`flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
          <span className="mr-2">{currentDirectory}$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;