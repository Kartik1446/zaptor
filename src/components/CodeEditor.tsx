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
      content: `// Welcome to Zaptor Code Editor!
// This is a fully functional code editor with syntax highlighting

// Variables and constants
const greeting = "Hello, World!";
let counter = 0;
var isActive = true;

// Functions
function calculateSum(a, b) {
  return a + b;
}

// Arrow functions
const multiply = (x, y) => x * y;

// Classes
class Calculator {
  constructor(name) {
    this.name = name;
  }
  
  add(a, b) {
    return a + b;
  }
  
  subtract(a, b) {
    return a - b;
  }
}

// Objects and arrays
const numbers = [1, 2, 3, 4, 5];
const person = {
  name: "John Doe",
  age: 30,
  city: "New York"
};

// Control structures
if (isActive) {
  console.log(greeting);
  console.log("Sum:", calculateSum(10, 20));
  console.log("Product:", multiply(5, 6));
}

// Loops
for (let i = 0; i < numbers.length; i++) {
  console.log(\`Number \${i + 1}: \${numbers[i]}\`);
}

// Modern JavaScript features
const doubled = numbers.map(num => num * 2);
const filtered = numbers.filter(num => num > 2);

console.log("Original numbers:", numbers);
console.log("Doubled:", doubled);
console.log("Filtered (> 2):", filtered);

// Try running this code with Ctrl+F5 or the Run button!`,
      language: 'javascript',
      isModified: false
    }
  ]);
  
  const [activeFileId, setActiveFileId] = useState<string>('1');
  const theme = 'dark'; // Fixed to dark theme
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('off');
  
  const editorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeFile = files.find(f => f.id === activeFileId);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      saveFile();
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyN, () => {
      createNewFile();
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO, () => {
      openFile();
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.F5, () => {
      runCode();
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      formatCode();
    });
    
    // Define custom black theme for dark mode with vibrant colors
    monaco.editor.defineTheme('black-theme', {
      base: 'vs-dark',
      inherit: false,
      rules: [
        // Base text
        { token: '', foreground: 'D4D4D4' },
        
        // Comments - Green and italic
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'comment.line.double-slash', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'comment.block', foreground: '6A9955', fontStyle: 'italic' },
        
        // Keywords - Bright blue and bold
        { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: 'C586C0', fontStyle: 'bold' },
        { token: 'keyword.operator', foreground: 'D4D4D4' },
        { token: 'keyword.other', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'storage.type', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'storage.modifier', foreground: '569CD6', fontStyle: 'bold' },
        
        // Strings - Orange/salmon
        { token: 'string', foreground: 'CE9178' },
        { token: 'string.quoted.single', foreground: 'CE9178' },
        { token: 'string.quoted.double', foreground: 'CE9178' },
        { token: 'string.template', foreground: 'CE9178' },
        { token: 'string.regexp', foreground: 'D16969' },
        
        // Numbers - Light green
        { token: 'constant.numeric', foreground: 'B5CEA8' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'constant.numeric.hex', foreground: 'B5CEA8' },
        { token: 'constant.numeric.decimal', foreground: 'B5CEA8' },
        
        // Functions - Yellow/gold
        { token: 'entity.name.function', foreground: 'DCDCAA', fontStyle: 'bold' },
        { token: 'support.function', foreground: 'DCDCAA' },
        { token: 'meta.function-call', foreground: 'DCDCAA' },
        { token: 'variable.function', foreground: 'DCDCAA' },
        
        // Variables - Light blue
        { token: 'variable', foreground: '9CDCFE' },
        { token: 'variable.parameter', foreground: '9CDCFE' },
        { token: 'variable.other', foreground: '9CDCFE' },
        { token: 'variable.language', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'variable.other.readwrite', foreground: '9CDCFE' },
        
        // Classes and types - Cyan/teal
        { token: 'entity.name.type', foreground: '4EC9B0', fontStyle: 'bold' },
        { token: 'entity.name.class', foreground: '4EC9B0', fontStyle: 'bold' },
        { token: 'support.type', foreground: '4EC9B0' },
        { token: 'support.class', foreground: '4EC9B0' },
        { token: 'entity.other.inherited-class', foreground: '4EC9B0' },
        
        // Constants - Light blue/cyan
        { token: 'constant', foreground: '4FC1FF', fontStyle: 'bold' },
        { token: 'constant.language', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'constant.character', foreground: '4FC1FF' },
        { token: 'constant.other', foreground: '4FC1FF' },
        { token: 'support.constant', foreground: '4FC1FF' },
        
        // Properties - Light blue
        { token: 'variable.other.property', foreground: '9CDCFE' },
        { token: 'support.variable.property', foreground: '9CDCFE' },
        { token: 'variable.other.object.property', foreground: '9CDCFE' },
        
        // Operators and punctuation
        { token: 'keyword.operator', foreground: 'D4D4D4' },
        { token: 'punctuation', foreground: 'D4D4D4' },
        { token: 'meta.brace', foreground: 'D4D4D4' },
        { token: 'punctuation.definition.block', foreground: 'D4D4D4' },
        
        // HTML/XML tags
        { token: 'entity.name.tag', foreground: '569CD6' },
        { token: 'entity.other.attribute-name', foreground: '9CDCFE' },
        
        // CSS
        { token: 'support.type.property-name', foreground: '9CDCFE' },
        { token: 'support.constant.property-value', foreground: 'CE9178' },
        
        // JSON
        { token: 'support.type.property-name.json', foreground: '9CDCFE' },
        { token: 'string.quoted.double.json', foreground: 'CE9178' },
        
        // JavaScript specific
        { token: 'support.variable.dom', foreground: '4EC9B0' },
        { token: 'support.constant.math', foreground: 'DCDCAA' },
        { token: 'support.class.console', foreground: '4EC9B0' },
        { token: 'entity.name.function.member', foreground: 'DCDCAA' },
        
        // Template literals
        { token: 'punctuation.definition.template-expression', foreground: 'C586C0' },
        { token: 'meta.template.expression', foreground: 'D4D4D4' },
        
        // Decorators
        { token: 'meta.decorator', foreground: 'DCDCAA' },
        { token: 'punctuation.decorator', foreground: 'DCDCAA' }
      ],
      colors: {
        'editor.background': '#000000',
        'editor.foreground': '#FFFFFF',
        'editorLineNumber.foreground': '#858585',
        'editorLineNumber.activeForeground': '#C6C6C6',
        'editorCursor.foreground': '#FFFFFF',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
        'editorIndentGuide.background': '#404040',
        'editorIndentGuide.activeBackground': '#707070',
        'editor.selectionHighlightBackground': '#ADD6FF26',
        'editorBracketMatch.background': '#0064001a',
        'editorBracketMatch.border': '#888888'
      }
    });

    // Define custom black theme for light mode
    monaco.editor.defineTheme('black-theme-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '0000FF' },
        { token: 'string', foreground: 'A31515' },
        { token: 'number', foreground: '098658' },
        { token: 'regexp', foreground: 'D16969' },
        { token: 'operator', foreground: '000000' },
        { token: 'namespace', foreground: '267F99' },
        { token: 'type', foreground: '267F99' },
        { token: 'struct', foreground: '267F99' },
        { token: 'class', foreground: '267F99' },
        { token: 'interface', foreground: '267F99' },
        { token: 'parameter', foreground: '001080' },
        { token: 'variable', foreground: '001080' },
        { token: 'property', foreground: '001080' },
        { token: 'enumMember', foreground: '0070C1' },
        { token: 'function', foreground: '795E26' },
        { token: 'member', foreground: '795E26' }
      ],
      colors: {
        'editor.background': '#000000',
        'editor.foreground': '#FFFFFF',
        'editorLineNumber.foreground': '#999999',
        'editorLineNumber.activeForeground': '#CCCCCC',
        'editorCursor.foreground': '#FFFFFF',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
        'editorIndentGuide.background': '#404040',
        'editorIndentGuide.activeBackground': '#707070',
        'editor.selectionHighlightBackground': '#ADD6FF26',
        'editorBracketMatch.background': '#0064001a',
        'editorBracketMatch.border': '#B9B9B9'
      }
    });
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
    
    console.clear();
    console.log(`🚀 Running ${activeFile.name}...`);
    
    try {
      if (activeFile.language === 'javascript') {
        // Override console.log to capture output
        const originalLog = console.log;
        const outputs: string[] = [];
        
        console.log = (...args) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          outputs.push(message);
          originalLog(`📄 Output:`, message);
        };
        
        // Execute the code
        const func = new Function(activeFile.content);
        const result = func();
        
        // Restore original console.log
        console.log = originalLog;
        
        if (result !== undefined) {
          console.log(`📤 Return value:`, result);
        }
        
        console.log(`✅ Execution completed successfully`);
        
      } else if (activeFile.language === 'html') {
        // Open HTML in new window
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(activeFile.content);
          newWindow.document.close();
          console.log(`🌐 HTML opened in new window`);
        }
        
      } else if (activeFile.language === 'css') {
        console.log(`🎨 CSS code preview:`);
        console.log(activeFile.content);
        
      } else if (activeFile.language === 'json') {
        try {
          const parsed = JSON.parse(activeFile.content);
          console.log(`📋 Valid JSON:`, parsed);
        } catch (jsonError) {
          console.error(`❌ Invalid JSON:`, jsonError);
        }
        
      } else {
        console.log(`📝 Code preview (${activeFile.language}):`);
        console.log(activeFile.content);
        console.log(`ℹ️ Direct execution not supported for ${activeFile.language}`);
      }
      
    } catch (error) {
      console.error(`❌ Execution error:`, error);
    }
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-2 border-b ${
        theme === 'dark' ? 'bg-black border-gray-700' : 'bg-gray-100 border-gray-300'
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
        theme === 'dark' ? 'bg-black border-gray-700' : 'bg-gray-100 border-gray-300'
      }`}>
        {files.map(file => (
          <div
            key={file.id}
            className={`flex items-center px-4 py-2 border-r cursor-pointer min-w-0 ${
              file.id === activeFileId
                ? theme === 'dark' ? 'bg-black border-gray-600' : 'bg-white border-gray-300'
                : theme === 'dark' ? 'bg-black border-gray-700 hover:bg-gray-800' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
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
          theme === 'dark' ? 'bg-black border-gray-700' : 'bg-gray-100 border-gray-300'
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
      <div className="flex-1 bg-black">
        {activeFile ? (
          <Editor
            height="100%"
            language={activeFile.language}
            value={activeFile.content}
            theme="black-theme"
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            loading={<div className="bg-black h-full w-full flex items-center justify-center text-white">Loading...</div>}
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
              suggest: {
                insertMode: 'replace',
                filterGraceful: true,
                showKeywords: true,
                showSnippets: true,
                showFunctions: true,
                showConstructors: true,
                showFields: true,
                showVariables: true,
                showClasses: true,
                showStructs: true,
                showInterfaces: true,
                showModules: true,
                showProperties: true,
                showEvents: true,
                showOperators: true,
                showUnits: true,
                showValues: true,
                showConstants: true,
                showEnums: true,
                showEnumMembers: true,
                showColors: true,
                showFiles: true,
                showReferences: true,
                showFolders: true,
                showTypeParameters: true
              },
              quickSuggestions: {
                other: true,
                comments: false,
                strings: false
              },
              parameterHints: { enabled: true },
              autoIndent: 'full',
              formatOnPaste: true,
              formatOnType: true,
              folding: true,
              foldingStrategy: 'indentation',
              showFoldingControls: 'always',
              lineNumbers: 'on',
              rulers: [80, 120],
              cursorBlinking: 'blink',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
              mouseWheelZoom: true,
              multiCursorModifier: 'ctrlCmd',
              selectionHighlight: true,
              occurrencesHighlight: 'singleFile',
              codeLens: true,
              colorDecorators: true,

              hover: { enabled: true },
              links: true,
              contextmenu: true,
              mouseWheelScrollSensitivity: 1,
              fastScrollSensitivity: 5,
              scrollbar: {
                useShadows: false,
                verticalHasArrows: true,
                horizontalHasArrows: true,
                vertical: 'visible',
                horizontal: 'visible',
                verticalScrollbarSize: 17,
                horizontalScrollbarSize: 17,
                arrowSize: 11
              }
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-black text-gray-400">
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