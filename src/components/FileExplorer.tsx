'use client';

import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  File, 
  Plus, 
  Trash2, 
  Edit3,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isExpanded?: boolean;
  content?: string;
}

interface FileExplorerProps {
  onFileSelect: (file: FileNode) => void;
  theme: 'light' | 'dark';
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect, theme }) => {
  const [fileTree, setFileTree] = useState<FileNode[]>([
    {
      id: '1',
      name: 'src',
      type: 'folder',
      isExpanded: true,
      children: [
        {
          id: '2',
          name: 'components',
          type: 'folder',
          isExpanded: false,
          children: [
            {
              id: '3',
              name: 'Button.tsx',
              type: 'file',
              content: 'import React from "react";\n\nconst Button = () => {\n  return <button>Click me</button>;\n};\n\nexport default Button;'
            }
          ]
        },
        {
          id: '4',
          name: 'utils',
          type: 'folder',
          isExpanded: false,
          children: [
            {
              id: '5',
              name: 'helpers.ts',
              type: 'file',
              content: 'export const formatDate = (date: Date) => {\n  return date.toLocaleDateString();\n};'
            }
          ]
        },
        {
          id: '6',
          name: 'App.tsx',
          type: 'file',
          content: 'import React from "react";\n\nfunction App() {\n  return (\n    <div className="App">\n      <h1>Hello World</h1>\n    </div>\n  );\n}\n\nexport default App;'
        }
      ]
    },
    {
      id: '7',
      name: 'package.json',
      type: 'file',
      content: '{\n  "name": "my-project",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.0.0"\n  }\n}'
    }
  ]);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    nodeId: string;
  } | null>(null);

  const toggleFolder = (nodeId: string) => {
    const updateNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId && node.type === 'folder') {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };
    setFileTree(updateNode(fileTree));
  };

  const handleNodeClick = (node: FileNode) => {
    if (node.type === 'folder') {
      toggleFolder(node.id);
    } else {
      onFileSelect(node);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      nodeId
    });
  };

  const createNewFile = (parentId: string) => {
    const newFile: FileNode = {
      id: Date.now().toString(),
      name: 'new-file.js',
      type: 'file',
      content: '// New file\n'
    };

    const addToParent = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === parentId && node.type === 'folder') {
          return {
            ...node,
            children: [...(node.children || []), newFile],
            isExpanded: true
          };
        }
        if (node.children) {
          return { ...node, children: addToParent(node.children) };
        }
        return node;
      });
    };

    setFileTree(addToParent(fileTree));
    setContextMenu(null);
  };

  const createNewFolder = (parentId: string) => {
    const newFolder: FileNode = {
      id: Date.now().toString(),
      name: 'new-folder',
      type: 'folder',
      children: [],
      isExpanded: false
    };

    const addToParent = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === parentId && node.type === 'folder') {
          return {
            ...node,
            children: [...(node.children || []), newFolder],
            isExpanded: true
          };
        }
        if (node.children) {
          return { ...node, children: addToParent(node.children) };
        }
        return node;
      });
    };

    setFileTree(addToParent(fileTree));
    setContextMenu(null);
  };

  const deleteNode = (nodeId: string) => {
    const removeNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.filter(node => {
        if (node.id === nodeId) {
          return false;
        }
        if (node.children) {
          node.children = removeNode(node.children);
        }
        return true;
      });
    };

    setFileTree(removeNode(fileTree));
    setContextMenu(null);
  };

  const renderNode = (node: FileNode, depth: number = 0) => {
    const paddingLeft = depth * 16;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center py-1 px-2 cursor-pointer hover:bg-opacity-80 ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          style={{ paddingLeft }}
          onClick={() => handleNodeClick(node)}
          onContextMenu={(e) => handleContextMenu(e, node.id)}
        >
          {node.type === 'folder' && (
            <span className="mr-1">
              {node.isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </span>
          )}
          <span className="mr-2">
            {node.type === 'folder' ? (
              node.isExpanded ? (
                <FolderOpen size={16} className="text-blue-500" />
              ) : (
                <Folder size={16} className="text-blue-500" />
              )
            ) : (
              <File size={16} className="text-gray-500" />
            )}
          </span>
          <span className="text-sm truncate">{node.name}</span>
        </div>
        {node.type === 'folder' && node.isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`h-full w-64 border-r overflow-y-auto ${
      theme === 'dark' ? 'bg-black border-gray-700' : 'bg-gray-50 border-gray-300'
    }`}>
      <div className={`p-2 border-b font-semibold text-sm ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
      }`}>
        Explorer
      </div>
      <div className="p-1">
        {fileTree.map(node => renderNode(node))}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setContextMenu(null)}
          />
          <div
            className={`fixed z-20 py-1 rounded shadow-lg border ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-600' 
                : 'bg-white border-gray-300'
            }`}
            style={{
              left: contextMenu.x,
              top: contextMenu.y
            }}
          >
            <button
              className={`w-full px-3 py-1 text-left text-sm hover:bg-opacity-80 flex items-center ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => createNewFile(contextMenu.nodeId)}
            >
              <Plus size={14} className="mr-2" />
              New File
            </button>
            <button
              className={`w-full px-3 py-1 text-left text-sm hover:bg-opacity-80 flex items-center ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => createNewFolder(contextMenu.nodeId)}
            >
              <Folder size={14} className="mr-2" />
              New Folder
            </button>
            <button
              className={`w-full px-3 py-1 text-left text-sm hover:bg-opacity-80 flex items-center text-red-500 ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => deleteNode(contextMenu.nodeId)}
            >
              <Trash2 size={14} className="mr-2" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FileExplorer;