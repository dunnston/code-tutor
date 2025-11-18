# Code Tutor - Project Plan

**Status**: Development (Active)
**Last Updated**: 2025-11-18
**Current Phase**: Phase 1 (Core IDE Interface)
**Phase 0 Completed**: ✅ 2025-11-18

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

## Phase 2: AI Tutor Integration 🤖
**Goal**: Connect AI models and implement Socratic tutoring system

### 2.1 Backend AI Setup
- [ ] Install Ollama dependencies in Rust
- [ ] Create Ollama API client (for local LLM)
- [ ] Create Claude API client (Anthropic SDK)
- [ ] Implement AI provider selection logic
- [ ] Add API key management (secure storage)

### 2.2 Tutor Prompt Engineering
- [ ] Design system prompt for Socratic method
- [ ] Create context payload (user code + lesson + console output)
- [ ] Implement hint progression system (vague → specific)
- [ ] Add anti-spoiler safeguards (prevent direct answers)
- [ ] Test prompts with sample scenarios

### 2.3 Chat Interface
- [ ] Create collapsible AI chat sidebar
- [ ] Add message history (user + AI)
- [ ] Implement message input with send button
- [ ] Add "Ask for Hint" quick action button
- [ ] Display AI thinking/loading state
- [ ] Add message timestamps

### 2.4 Contextual Help
- [ ] Send user code to AI when requesting help
- [ ] Include console output in AI context
- [ ] Add current lesson objectives to context
- [ ] Detect prolonged struggle (no progress in 5 min)
- [ ] Offer proactive help after struggle threshold

---

## Phase 3: Curriculum System 📚
**Goal**: Build lesson data structure, navigation, and validation

### 3.1 Lesson Data Structure
- [ ] Design JSON schema for lessons
  - [ ] Lesson metadata (id, title, description, difficulty)
  - [ ] Starter code, solution code
  - [ ] Validation criteria (output matching, code checks)
  - [ ] Hints array (progressive difficulty)
  - [ ] XP reward, prerequisites
- [ ] Create lesson loader utility
- [ ] Implement lesson parser and validator

### 3.2 Lesson Renderer
- [ ] Create lesson content component (left panel)
- [ ] Render markdown content with syntax highlighting
- [ ] Add image/video embedding support
- [ ] Display assignment instructions clearly
- [ ] Show lesson progress (current/total lessons)

### 3.3 Python Track (Beginner)
- [ ] Lesson 1: "The Scroll of Print" (print statements)
- [ ] Lesson 2: "Variables of Power" (variables & data types)
- [ ] Lesson 3: "The Conditional Path" (if/else statements)
- [ ] Lesson 4: "The Loop of Destiny" (for/while loops)
- [ ] Lesson 5: "The Function Forge" (defining functions)
- [ ] Lessons 6-15: Expand to cover lists, dicts, file I/O, classes

### 3.4 Exercise Validation
- [ ] Implement output matching (expected vs. actual)
- [ ] Add regex-based output validation
- [ ] Implement code structure checks (e.g., "must use a loop")
- [ ] Create visual feedback (success/error messages)
- [ ] Award XP on successful completion
- [ ] Unlock next lesson after validation passes

### 3.5 Hint System
- [ ] Display hints progressively (1 → 2 → 3)
- [ ] Integrate AI-generated hints as fallback
- [ ] Track hint usage in progress data
- [ ] Add XP penalty for using too many hints (optional)

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
