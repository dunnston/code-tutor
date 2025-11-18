# Code Tutor

An interactive coding education platform that teaches programming through hands-on challenges with AI-powered tutoring. Designed to take learners from absolute beginners to skilled, hireable programmers.

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Backend**: Tauri 2.x (Rust)
- **Styling**: Tailwind CSS
- **Editor**: Monaco Editor (VS Code's editor)
- **AI**: Dual LLM support (Ollama local + Claude API)
- **Build**: Vite

## Prerequisites

- Node.js 18+ (v22.14.0 recommended)
- Rust 1.70+ (v1.90.0 recommended)
- Python 3.x (for executing user code)
- Optional: Ollama (for local AI)

## Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Run the web app in development mode
npm run dev

# Run the Tauri desktop app in development mode
npm run tauri:dev
```

The web app will be available at `http://localhost:1420`

### Build

```bash
# Build the web app
npm run build

# Build the Tauri desktop app
npm run tauri:build
```

## Project Structure

```
code-tutor/
├── src/                    # React frontend source
│   ├── components/         # Reusable UI components
│   ├── features/           # Feature-based modules
│   ├── lib/                # Utilities and helpers
│   ├── types/              # TypeScript type definitions
│   ├── hooks/              # Custom React hooks
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── src-tauri/              # Rust backend (Tauri)
│   ├── src/                # Rust source code
│   │   └── main.rs         # Tauri main entry
│   ├── Cargo.toml          # Rust dependencies
│   └── tauri.conf.json     # Tauri configuration
├── docs/                   # Documentation
│   ├── PRD.md              # Product Requirements Document
│   ├── gamification.md     # Gamification design
│   └── lessons/            # Lesson content (JSON)
├── CLAUDE.md               # Project guidelines for development
├── PROJECT_PLAN.md         # Development roadmap
└── package.json            # Node dependencies
```

## Development Workflow

1. **Never commit to main** - Always use feature branches
2. **Branch naming**: `feature/`, `fix/`, `refactor/`
3. **Check off tasks** in PROJECT_PLAN.md as you complete them
4. **Follow guidelines** in CLAUDE.md
5. **Test before committing** - Run `npm run lint` and `npm run build`

### Example Workflow

```bash
# Create a feature branch
git checkout -b feature/add-lesson-system

# Make changes...

# Commit your work
git add .
git commit -m "Add lesson loading system"

# Merge to main (via PR or directly)
git checkout master
git merge feature/add-lesson-system
```

## Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build web app for production
- `npm run preview` - Preview production build
- `npm run tauri:dev` - Start Tauri app in development
- `npm run tauri:build` - Build Tauri app for distribution
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Current Status

**Phase 0: Foundation** (In Progress)
- ✅ Git repository initialized
- ✅ Tauri 2.x project set up
- ✅ React 18+ with TypeScript configured
- ✅ Tailwind CSS with design tokens
- ✅ Base project structure created
- ✅ ESLint and Prettier configured
- ⏳ Next: Build core IDE interface (Monaco editor + console)

See [PROJECT_PLAN.md](PROJECT_PLAN.md) for the full roadmap.

## Contributing

This is a personal project, but feedback and suggestions are welcome! Please open an issue to discuss before making major changes.

## License

MIT

---

**Built with ❤️ for learners everywhere**
