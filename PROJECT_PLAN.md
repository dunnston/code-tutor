# Code Tutor - Project Plan

**Status**: Development (Active)
**Last Updated**: 2025-11-18
**Current Phase**: Phase 3 Complete → Phase 4 (Progress & Gamification)
**Phases Completed**:
- ✅ Phase 0: Foundation (2025-11-18)
- ✅ Phase 1: Core IDE Interface (2025-11-18)
- ✅ Phase 2: AI Tutor Integration (2025-11-18)
- ✅ Phase 3: Curriculum System (2025-11-18)

---

## Overview

This document tracks the development roadmap for Code Tutor, an interactive coding education platform. The project is broken into 7 phases, progressing from basic infrastructure to advanced features and deployment.

**Update this document as you complete tasks** - mark items with `[x]` when done.

---

## Phase 0: Foundation ⚙️
**Goal**: Set up project infrastructure and development environment
**Status**: ✅ Completed (2025-11-18)

- [x] Initialize Tauri 2.x project with Vite + React template
- [x] Configure TypeScript with strict mode
- [x] Set up Tailwind CSS with custom design tokens
  - [x] Define color palette (dark theme + orange accents)
  - [x] Configure spacing, typography, and component utilities
- [x] Create base project structure (components, features, lib, types)
- [x] Set up Git repository and `.gitignore`
- [x] Create initial README.md with setup instructions
- [ ] Install core dependencies:
  - [ ] Monaco Editor (@monaco-editor/react)
  - [ ] Zustand or Redux (state management)
  - [ ] React Router (navigation)
  - [ ] Axios (API calls)
- [x] Configure ESLint + Prettier for code quality
- [x] Set up development scripts (dev, build, test)
- [x] Test development server (working at localhost:1420)

---

## Phase 1: Core IDE Interface 💻
**Goal**: Build the split-panel IDE with code editing and execution
**Status**: 🟢 In Progress (Core features complete, refinements pending)

### 1.1 Layout & Navigation
- [x] Create main app shell (header, split panels, footer)
- [x] Implement split-panel component (resizable with react-resizable-panels)
- [x] Add lesson navigation (previous/next buttons in LessonPanel)
- [x] Create progress indicator in header
- [ ] Add settings menu (theme toggle, AI provider selection)

### 1.2 Monaco Editor Integration
- [x] Integrate Monaco Editor component
- [x] Configure Python syntax highlighting
- [x] Set up dark theme matching design system
- [x] Add line numbers and basic editor features
- [x] Implement code save/load to local storage (auto-save with 1s debounce)
- [x] Add "Reset Code" functionality

### 1.3 Console Output
- [x] Create console output component (below editor)
- [x] Display stdout in real-time
- [x] Display stderr with error styling (red text)
- [x] Add "Clear Console" button
- [x] Implement auto-scroll to latest output

### 1.4 Code Execution Engine (Rust Backend)
- [x] Create Tauri command for Python execution
- [x] Implement process spawning in Rust
- [x] Add execution timeout (5 seconds default, configurable)
- [ ] Add resource limits (memory, CPU) - *deferred to Phase 2*
- [x] Handle process errors gracefully
- [x] Return stdout, stderr, exit code, and execution time to frontend
- [x] Wire up "Run" button with loading state

### 1.5 Action Buttons
- [x] Implement "Run" button (execute code via Tauri)
- [x] Implement "Submit" button (with validation system)
- [x] Implement "Reset" button (restore starter code + clear storage)
- [x] Add "Solution" button (placeholder, gated)
- [x] Add keyboard shortcuts (Ctrl+Enter to run)

### 1.6 Lesson System & Navigation
- [x] Create lesson loader utility (loads all 5 Python lessons)
- [x] Implement lesson navigation (previous/next buttons)
- [x] Create validation system (output checks, code checks)
- [x] Display validation results in console
- [x] Award XP on successful completion

---

## Phase 2: AI Tutor Integration 🤖 ✅
**Goal**: Connect AI models and implement Socratic tutoring system
**Status**: COMPLETED

### 2.1 Frontend AI Infrastructure
- [x] Create AI TypeScript types (ChatMessage, AIProvider, ChatContext)
- [x] Build Ollama provider with streaming support
- [x] Build Claude API provider with streaming support
- [x] Create AIService manager singleton
- [x] Add AI state management to Zustand store
- [x] Implement provider selection and switching logic

### 2.2 Tutor Prompt Engineering
- [x] Design system prompt for Socratic method
- [x] Create context payload (user code + lesson + console output + chat history)
- [x] Add anti-spoiler safeguards (prevent direct answers)
- [x] Implement adaptive help levels in system prompt
- [x] Add positive reinforcement guidelines

### 2.3 Chat Interface
- [x] Create ChatPanel component with collapsible sidebar
- [x] Add message history (user + AI) with auto-scroll
- [x] Implement message input with send button
- [x] Add keyboard shortcuts (Enter to send, Shift+Enter for newline)
- [x] Display AI thinking/loading state
- [x] Add message timestamps
- [x] Create floating chat button when closed

### 2.4 AI Provider Settings
- [x] Add provider selection UI (Ollama vs Claude)
- [x] Implement Claude API key input and secure storage
- [x] Add settings panel in chat interface
- [x] Save provider preference and API key to localStorage

### 2.5 Integration
- [x] Integrate ChatPanel into App.tsx with resizable panels
- [x] Wire up chat state to global store
- [x] Send lesson context (code, lesson objectives) to AI
- [x] Connect chat messages to AI service

**Next Phase**: Advanced features (proactive help, hint progression, struggle detection)

---

## Phase 3: Curriculum System 📚 ✅ COMPLETE
**Goal**: Build lesson data structure, navigation, and validation
**Status**: COMPLETE (2025-11-18)

### 3.1 Lesson Data Structure ✅
- [x] Design JSON schema for lessons
  - [x] Lesson metadata (id, title, description, difficulty)
  - [x] Starter code, solution code
  - [x] Validation criteria (output matching, code checks)
  - [x] XP reward, prerequisites
  - [x] Hints array (progressive difficulty)
- [x] Create lesson loader utility (lib/lessons.ts)
- [x] Implement lesson parser and validator

### 3.2 Lesson Renderer ✅
- [x] Create lesson content component (LessonPanel)
- [x] Render markdown content with syntax highlighting
- [x] Display assignment instructions clearly
- [x] Show lesson progress (current/total lessons)
- [x] Add previous/next navigation buttons
- [ ] Add image/video embedding support - OPTIONAL (deferred)

### 3.3 Python Track (Beginner) ✅
- [x] Lesson 1: "The Scroll of Print" (print statements)
- [x] Lesson 2: "Variables of Power" (variables & data types)
- [x] Lesson 3: "The Conditional Path" (if/else statements)
- [x] Lesson 4: "The Loop of Destiny" (for/while loops)
- [x] Lesson 5: "The Function Forge" (defining functions)
- [x] Lesson 6: "The List Quest" (lists & arrays basics)
- [x] Lesson 7: "The List Magic" (list operations & methods)
- [x] Lesson 8: "The Dictionary Codex" (dictionaries basics)
- [x] Lesson 9: "The Scroll Keeper" (file I/O operations)
- [x] Lesson 10: "The Class Blueprint" (classes & objects)

### 3.4 Exercise Validation ✅
- [x] Implement output matching (expected vs. actual)
- [x] Add regex-based output validation
- [x] Implement code structure checks (lib/validation.ts)
- [x] Create visual feedback (success/error messages in console)
- [x] Award XP on successful completion
- [x] Unlock next lesson after validation passes

### 3.5 Hint System ✅
- [x] Add hints array to lesson JSON structure
- [x] Display hints progressively (1 → 2 → 3) in LessonPanel
- [x] Show hint count (revealed/total)
- [x] Progressive reveal with "Show Next Hint" button
- [x] Reset hints when lesson changes
- [x] Integrate AI-generated hints as fallback (AI Tutor available!)
- [ ] Track hint usage in progress data (Phase 4)
- [ ] Add XP penalty for using too many hints (optional - Phase 4)

### 3.6 Progress & Unlocking System ✅
- [x] Create progress tracking data structure (UserProgress)
- [x] Implement local storage for progress (loadProgress, saveProgress)
- [x] Add progress state to Zustand store
- [x] Implement lesson completion tracking (markLessonComplete)
- [x] Create lesson unlocking logic (isLessonUnlocked)
- [x] Update LessonPanel to show locked/unlocked lessons
- [x] Display checkmark for completed lessons
- [x] Show total XP earned in Header
- [x] Disable "Next Lesson" button with lock icon if locked

---

## Phase 4: Progress & Gamification 🎯
**Goal**: Track user progress and implement motivational features

### 4.1 Progress Tracking
- [ ] Design user progress data structure
  - [ ] Completed lessons, current lesson
  - [ ] XP total, level
  - [ ] Badges earned, streaks
  - [ ] Time spent per lesson
- [ ] Implement local storage persistence
- [ ] Create progress dashboard view
- [ ] Add progress export (JSON download)

### 4.2 XP & Leveling
- [ ] Implement XP calculation (base + bonus)
- [ ] Create level-up system (e.g., 100 XP per level, exponential)
- [ ] Add XP animation on lesson completion
- [ ] Display current level in UI (header/profile)
- [ ] Design level-up notification/modal

### 4.3 Achievements & Badges
- [ ] Design badge system (icons + descriptions)
- [ ] Create badges for milestones:
  - [ ] "First Steps" (complete first lesson)
  - [ ] "Streak Master" (7-day streak)
  - [ ] "Speed Demon" (complete lesson in < 5 min)
  - [ ] "Persistent" (retry lesson 5+ times)
  - [ ] "Independent" (complete lesson without hints)
- [ ] Add badge collection view
- [ ] Implement badge unlock notifications

### 4.4 Streaks & Daily Goals
- [ ] Track daily login and lesson completion
- [ ] Implement streak counter (consecutive days)
- [ ] Add streak recovery (1-day grace period)
- [ ] Create daily goal reminders (optional notifications)
- [ ] Display streak in UI (header icon + count)

---

## Phase 5: Multi-Language Support 🌐
**Goal**: Expand beyond Python to GDScript, C#, React/JS, Ruby

### 5.1 Language Abstraction
- [ ] Refactor execution engine to support multiple languages
- [ ] Create language registry (Python, GDScript, C#, JS, Ruby)
- [ ] Add language-specific syntax highlighting in Monaco
- [ ] Implement language switcher in lesson metadata

### 5.2 GDScript Support
- [ ] Add Godot runtime requirement check
- [ ] Implement GDScript execution via Godot CLI
- [ ] Create GDScript starter lessons (5-10 lessons)
- [ ] Add GDScript-specific validation

### 5.3 C# Support
- [ ] Add .NET runtime requirement check
- [ ] Implement C# execution via `dotnet run`
- [ ] Create C# starter lessons (5-10 lessons)
- [ ] Add C# syntax and best practices

### 5.4 React/JavaScript Support
- [ ] Add Node.js runtime requirement check
- [ ] Implement JS execution via Node
- [ ] Add JSX preview pane (live rendering)
- [ ] Create React lessons (5-10 lessons)
- [ ] Add component sandbox environment

### 5.5 Ruby Support
- [ ] Add Ruby runtime requirement check
- [ ] Implement Ruby execution via `ruby` CLI
- [ ] Create Ruby starter lessons (5-10 lessons)
- [ ] Add Ruby syntax and conventions

---

## Phase 6: Advanced IDE Features 🚀
**Goal**: Add professional development tools (unlocked at intermediate+ lessons)

### 6.1 Multi-File Support
- [ ] Add file explorer sidebar (tree view)
- [ ] Implement file create/delete/rename
- [ ] Support multi-file projects (folders)
- [ ] Add file tabs in editor
- [ ] Implement file save/load across project

### 6.2 Debugging Tools
- [ ] Add breakpoint support (language-dependent)
- [ ] Implement step-through debugging UI
- [ ] Show variable inspector (locals, globals)
- [ ] Add call stack viewer
- [ ] Create debugging tutorial lessons

### 6.3 Enhanced Code Completion
- [ ] Integrate language servers (LSP)
- [ ] Add IntelliSense-style autocomplete
- [ ] Show function signatures and docs
- [ ] Implement snippet support

### 6.4 Version Control Integration
- [ ] Add basic Git UI (commit, status)
- [ ] Show file diff view
- [ ] Implement commit history viewer
- [ ] Add Git tutorial lessons

---

## Phase 7: Polish & Deployment ✨
**Goal**: Finalize UX, optimize performance, and prepare for release

### 7.1 Onboarding Flow
- [ ] Create welcome screen with app intro
- [ ] Add language selection (starting track)
- [ ] Implement user profile setup (name, avatar)
- [ ] Create tutorial overlay for first-time users
- [ ] Add "Skip Tutorial" option

### 7.2 Settings & Preferences
- [ ] Add settings modal/page
  - [ ] Theme selection (dark/light)
  - [ ] AI provider (Ollama/Claude)
  - [ ] Font size, editor preferences
  - [ ] Notification settings
- [ ] Implement preference persistence
- [ ] Add "Reset Progress" option (with confirmation)

### 7.3 Offline Mode
- [ ] Cache lessons locally for offline access
- [ ] Implement offline indicator in UI
- [ ] Queue AI requests for when online
- [ ] Add offline-friendly validation (no AI hints)

### 7.4 Performance Optimization
- [ ] Lazy load Monaco Editor
- [ ] Optimize bundle size (code splitting)
- [ ] Implement virtual scrolling for lesson lists
- [ ] Profile and fix rendering bottlenecks
- [ ] Minimize Tauri app bundle size

### 7.5 Cross-Platform Testing
- [ ] Test on Windows (10/11)
- [ ] Test on macOS (Intel/Apple Silicon)
- [ ] Test on Linux (Ubuntu, Fedora)
- [ ] Fix platform-specific issues
- [ ] Test web build (if applicable)

### 7.6 Documentation
- [ ] Write developer setup guide
- [ ] Create user manual/help docs
- [ ] Add inline tooltips for UI elements
- [ ] Document lesson creation format
- [ ] Create contribution guidelines (if open-source)

### 7.7 Release Preparation
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Create app installers (MSI, DMG, AppImage)
- [ ] Design app icon and branding assets
- [ ] Write release notes
- [ ] Create landing page or marketing site
- [ ] Plan beta testing phase

---

## Future Enhancements (Post-MVP)
These are ideas for after the initial release:

- [ ] Multi-user accounts (cloud sync)
- [ ] Leaderboards and competitive challenges
- [ ] Community-contributed lessons
- [ ] Code review AI (analyze user's code quality)
- [ ] Mobile app (iOS/Android)
- [ ] Live coding sessions with AI
- [ ] Integration with coding platforms (LeetCode, HackerRank)
- [ ] Custom lesson builder (for educators)

---

## Notes & Decisions Log

**2025-11-18**: Initial project plan created. Decided on Tauri + React stack with dual AI support (Ollama + Claude). UI design inspired by modern coding platforms with dark theme and orange accents.

---

**Remember**: Update this document frequently. Check off tasks as you complete them. Add new tasks as you discover them during development. This is your single source of truth for project progress.
