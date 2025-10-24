# Code Editor IDE

A fully-featured online code editor built with Next.js, React, and Monaco Editor. This IDE provides a complete development environment in your browser with file management, terminal capabilities, and optional authentication.

## 🚀 Quick Start

1. **Clone and Install**:
```bash
git clone <repository-url>
cd code-editor-ide
npm install
```

2. **Run the Development Server**:
```bash
npm run dev
```

3. **Open in Browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

The IDE will work immediately without any additional setup!

## ✨ Features

### 🎨 **Modern IDE Interface**
- Clean, professional interface with dark/light theme support
- Resizable panels and customizable layout
- Status bar with file information and cursor position
- Full-screen mode support

### 📝 **Advanced Code Editor**
- Powered by Monaco Editor (VS Code's editor)
- Syntax highlighting for 20+ programming languages
- IntelliSense and auto-completion
- Code formatting and bracket matching
- Minimap and line numbers
- Find and replace functionality
- Multiple file tabs with unsaved changes indicator
- Customizable font size and word wrap

### 📁 **File Management**
- Interactive file tree with expand/collapse
- Create, delete, and rename files/folders
- Context menu with file operations
- Upload files from your computer
- Download files to your computer
- Support for multiple file types

### 🔍 **Search & Replace**
- Global search across all files
- Advanced search options (case sensitive, whole word, regex)
- Find and replace functionality
- Search results with file locations and line numbers

### 💻 **Integrated Terminal**
- Full-featured terminal emulator
- Command history and tab completion
- Support for common Unix-like commands (ls, cd, mkdir, etc.)
- Mock execution for JavaScript and Python files
- Git command simulation
- npm/yarn command support

### 🎯 **Language Support**
- JavaScript/TypeScript (.js, .jsx, .ts, .tsx)
- Python (.py)
- HTML/CSS (.html, .css)
- JSON/XML (.json, .xml)
- Markdown (.md)
- Java (.java)
- C/C++ (.c, .cpp)
- PHP (.php)
- Ruby (.rb)
- Go (.go)
- Rust (.rs)
- Shell scripts (.sh)
- And more!

### 🔐 **Optional Authentication**
- Secure user authentication with Clerk (optional)
- Works without authentication by default
- Easy setup for user management
- See [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) for details

## 🛠 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Editor**: Monaco Editor (VS Code's editor engine)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: Clerk (optional)
- **Database**: Convex (optional, for future features)

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and scrollbar customization
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── CodeEditor.tsx       # Main code editor with Monaco
│   ├── FileExplorer.tsx     # File tree and management
│   ├── Terminal.tsx         # Terminal emulator
│   ├── SearchPanel.tsx      # Search and replace functionality
│   ├── IDE.tsx              # Main IDE container
│   └── providers/           # Authentication providers (optional)
└── middleware.ts            # Clerk middleware (optional)
```

## 🎮 Usage Guide

### Basic Operations
- **New File**: Click the "New File" button or use Ctrl+N
- **Open File**: Click "Open File" to upload from your computer
- **Save File**: Click "Save" to download the current file
- **File Tabs**: Switch between open files using tabs

### Editor Features
- **Theme Toggle**: Switch between light and dark themes
- **Settings**: Adjust font size, word wrap, and other preferences
- **Run Code**: Execute JavaScript code directly in the browser
- **Format Code**: Auto-format your code (Shift+Alt+F)

### File Explorer
- **Right-click** on folders to create new files/folders
- **Click** on files to open them in the editor
- **Expand/collapse** folders by clicking the arrow icons

### Terminal Usage
- **Toggle Terminal**: Click the terminal icon in the top bar
- **Commands**: Use standard Unix-like commands
- **History**: Use arrow keys to navigate command history
- **Tab Completion**: Press Tab to auto-complete commands

### Search Functionality
- **Global Search**: Click the search icon to open search panel
- **Find & Replace**: Toggle replace mode for find and replace
- **Search Options**: Use regex, case-sensitive, and whole-word matching

## 🔧 Customization

### Adding New Languages
To add support for new programming languages, update the language mapping in `CodeEditor.tsx`:

```typescript
const languageMap: Record<string, string> = {
  'your_extension': 'monaco_language_id',
  // ... existing mappings
};
```

### Theming
The IDE supports custom themes. Modify the theme objects in the components or extend Tailwind CSS configuration.

### Terminal Commands
Add new terminal commands by extending the switch statement in `Terminal.tsx`:

```typescript
case 'your_command':
  // Your command logic here
  break;
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - The code editor that powers VS Code
- [Next.js](https://nextjs.org/) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide React](https://lucide.dev/) - Beautiful & consistent icon toolkit
- [Clerk](https://clerk.com/) - Complete user management platform

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Review the [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) for auth-related questions
3. Create a new issue with detailed information about your problem

---

**Happy Coding! 🎉**