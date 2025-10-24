'use client';

import React, { useState } from 'react';
import { Search, X, Replace, Type, FileText, Hash } from 'lucide-react';

interface SearchPanelProps {
  theme: 'light' | 'dark';
  isVisible: boolean;
  onClose: () => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ theme, isVisible, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [showReplace, setShowReplace] = useState(false);
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{
    file: string;
    line: number;
    content: string;
    match: string;
  }>>([]);

  const handleSearch = () => {
    // Mock search results
    const mockResults = [
      {
        file: 'src/components/Button.tsx',
        line: 5,
        content: 'const Button = () => {',
        match: searchTerm
      },
      {
        file: 'src/utils/helpers.ts',
        line: 12,
        content: 'export const formatDate = (date: Date) => {',
        match: searchTerm
      }
    ];
    
    if (searchTerm.trim()) {
      setSearchResults(mockResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleReplace = () => {
    console.log('Replace:', searchTerm, 'with:', replaceTerm);
  };

  const handleReplaceAll = () => {
    console.log('Replace all:', searchTerm, 'with:', replaceTerm);
  };

  if (!isVisible) return null;

  return (
    <div className={`w-80 border-r h-full overflow-y-auto ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-3 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
      }`}>
        <div className="flex items-center space-x-2">
          <Search size={16} />
          <span className="font-medium text-sm">Search</span>
        </div>
        <button
          onClick={onClose}
          className={`p-1 rounded hover:bg-opacity-80 ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          <X size={14} />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className={`w-full px-3 py-2 pr-8 rounded border text-sm ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <Search size={14} />
          </button>
        </div>

        {/* Replace Input */}
        {showReplace && (
          <div className="relative">
            <input
              type="text"
              placeholder="Replace"
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              className={`w-full px-3 py-2 pr-8 rounded border text-sm ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        )}

        {/* Search Options */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMatchCase(!matchCase)}
              className={`p-1 rounded text-xs ${
                matchCase 
                  ? 'bg-blue-600 text-white' 
                  : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
              title="Match Case"
            >
              <Type size={14} />
            </button>
            <button
              onClick={() => setWholeWord(!wholeWord)}
              className={`p-1 rounded text-xs ${
                wholeWord 
                  ? 'bg-blue-600 text-white' 
                  : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
              title="Match Whole Word"
            >
              <FileText size={14} />
            </button>
            <button
              onClick={() => setUseRegex(!useRegex)}
              className={`p-1 rounded text-xs ${
                useRegex 
                  ? 'bg-blue-600 text-white' 
                  : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
              title="Use Regular Expression"
            >
              <Hash size={14} />
            </button>
          </div>
          <button
            onClick={() => setShowReplace(!showReplace)}
            className={`p-1 rounded ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="Toggle Replace"
          >
            <Replace size={14} />
          </button>
        </div>

        {/* Replace Buttons */}
        {showReplace && (
          <div className="flex space-x-2">
            <button
              onClick={handleReplace}
              className={`px-3 py-1 text-xs rounded ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Replace
            </button>
            <button
              onClick={handleReplaceAll}
              className={`px-3 py-1 text-xs rounded ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Replace All
            </button>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className={`border-t ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
      }`}>
        <div className="p-3">
          <div className="text-sm font-medium mb-2">
            {searchResults.length} results
          </div>
          <div className="space-y-2">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className={`p-2 rounded cursor-pointer hover:bg-opacity-80 ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                <div className="text-xs text-blue-500 mb-1">{result.file}</div>
                <div className="text-sm">
                  <span className="text-gray-500 mr-2">Line {result.line}:</span>
                  <span>{result.content}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;