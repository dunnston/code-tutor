Excellent! Let's create a comprehensive spec doc for Claude Code. I'll structure this as a complete PRD (Product Requirements Document).

---

# **Code Learning Coach - Product Requirements Document**

## **Project Overview**

**Name:** Code Tutor (working title)

**Purpose:** A cross-platform desktop and web-ready application that teaches programming through hands-on, interactive coding challenges with AI-powered tutoring. Designed to take learners from absolute beginners to skilled, hireable programmers capable of building production-quality applications.

**Target Users:**
- **Primary:** Adults and teenagers seeking to become professional developers
- **Secondary:** Career changers and self-learners building portfolios
- **Tertiary:** Students supplementing formal education
- **Family-friendly:** Appropriate for all ages with parental guidance

**Core Philosophy:**
- **Learn by doing, not reading** - Practical implementation over theory
- **See results immediately** - Instant feedback and visual outputs
- **Adaptive difficulty** - AI tutor adjusts to individual pace and skill
- **Production-ready skills** - Real-world coding practices from day one

**Key Principles:**
- Local-first (no hosting required initially, privacy-focused)
- Works offline (with local LLM option)
- Progressive complexity (beginner → intermediate → advanced → professional)
- Security-conscious (sandboxed code execution)
- Clean, modern UI (intuitive navigation, minimal clutter)

---

## **Technical Stack**

### **Desktop Framework**
- **Tauri 2.x** (Rust backend, web frontend)
- Cross-platform: macOS (M-series + Intel), Windows
- Produces native installers (.dmg, .exe)

### **Frontend**
- **React 18+** with TypeScript
- **Monaco Editor** (VS Code's editor component)
- **TailwindCSS** for styling
- **Zustand** or **Context API** for state management

### **Backend (Tauri/Rust)**
- **Code Execution Engine**
  - Python subprocess execution
  - Godot execution (future)
  - C# execution (future)
- **SQLite** for local data storage
- **File system** for saving user code/projects

### **AI/LLM Integration**
- **Dual-mode support:**
  1. **Local:** Ollama integration (HTTP API to localhost:11434)
  2. **Cloud:** Claude API (Anthropic)
- **Abstracted provider interface** (easy to add more providers)

### **Database Schema (SQLite)**
```sql
-- User progress tracking
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning tracks (Python basics, Godot intro, etc.)
CREATE TABLE tracks (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    language TEXT NOT NULL, -- 'python', 'gdscript', 'csharp'
    order_index INTEGER
);

-- Individual lessons/challenges
CREATE TABLE lessons (
    id INTEGER PRIMARY KEY,
    track_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    difficulty INTEGER, -- 1-10
    starter_code TEXT,
    solution_code TEXT, -- Hidden from user
    validation_tests TEXT, -- JSON array of test cases
    order_index INTEGER,
    FOREIGN KEY (track_id) REFERENCES tracks(id)
);

-- User progress on lessons
CREATE TABLE user_progress (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    lesson_id INTEGER,
    status TEXT, -- 'not_started', 'in_progress', 'completed'
    user_code TEXT, -- Last saved code
    attempts INTEGER DEFAULT 0,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Chat history with AI coach
CREATE TABLE chat_history (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    lesson_id INTEGER,
    role TEXT, -- 'user' or 'assistant'
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- App settings
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
```

---

## **UI/UX Design**

### **Visual Design System**

**Color Palette:**
- **Background:** Dark navy/slate (`#1a1d29`, `#0f1117`)
- **Surface:** Lighter slate (`#252837`, `#2a2f42`)
- **Text Primary:** Near-white (`#e5e7eb`, `#f3f4f6`)
- **Text Secondary:** Muted gray (`#9ca3af`, `#6b7280`)
- **Accent:** Warm orange (`#fb923c`, `#f59e0b`) for CTAs and highlights
- **Success:** Green (`#22c55e`)
- **Error:** Red (`#ef4444`)
- **Warning:** Yellow (`#fbbf24`)

**Typography:**
- **Headings:** Inter or System UI, bold
- **Body:** Inter or System UI, regular
- **Code:** JetBrains Mono or Fira Code, monospace

### **Layout Architecture**

**Split-Panel Design:**
```
┌────────────────────────────────────────────────────────────────┐
│  [Code Tutor]    [Lesson Progress: 3/15]    [User] [Settings]  │
├────────────────────────────┬───────────────────────────────────┤
│                            │                                   │
│   LESSON CONTENT PANEL     │   CODE EDITOR                     │
│   (Left 40%)               │   (Right 60%)                     │
│                            │                                   │
│  Welcome to Lesson 3       │   1  print("Welcome to...")      │
│  "The Conditional Path"    │   2                               │
│                            │   3  age = 25                     │
│  In this lesson you'll...  │   4  if age >= 18:               │
│                            │   5      print("Adult")           │
│  Assignment:               │   6                               │
│  1. Press Run to test      │                                   │
│  2. Press Submit when done │   ┌─────────────────────────────┐│
│                            │   │ CONSOLE OUTPUT              ││
│  [▶ Next Lesson]           │   │                             ││
│                            │   │ > Welcome to...             ││
│                            │   │ > Adult                     ││
│                            │   │                             ││
│                            │   └─────────────────────────────┘│
│                            │                                   │
│                            │   [Submit] [Run] [Solution] [Reset]│
└────────────────────────────┴───────────────────────────────────┘
```

**Key UI Elements:**
- **Header:** Fixed at top, shows progress, user profile, settings
- **Lesson Panel (Left):** Markdown content, instructions, assignment criteria
- **Editor Panel (Right Top):** Monaco editor with line numbers, syntax highlighting
- **Console Panel (Right Bottom):** Integrated output display below editor
- **Action Bar:** Submit (accent orange), Run (secondary), Solution (gated), Reset buttons
- **Resizable Panels:** Drag dividers to adjust panel sizes

### **Progressive Feature Unlocking**

**Phase 1: Simple IDE (Beginner Lessons)**
- Single-file editor only
- Inline console output
- Basic Run/Submit/Reset actions
- No file explorer or multi-file support
- Debugging via `print()` statements

**Phase 2: Enhanced IDE (Intermediate Lessons)**
- Syntax error highlighting
- Improved autocomplete
- Code snippets/templates
- Execution time display
- Better error explanations

**Phase 3: Professional IDE (Advanced Lessons)**
- Multi-file project support
- File explorer tree
- Debugging tools (breakpoints, step-through)
- Variable inspector
- Basic version control (Git)

### **Responsive Behavior**
- **Desktop (>1200px):** Full split-panel layout
- **Tablet (768-1200px):** Narrower panels, collapsible lesson panel
- **Mobile (<768px):** Stacked vertical layout (lesson → editor → console)

### **Interaction Patterns**
- **Keyboard Shortcuts:**
  - `Ctrl/Cmd + Enter`: Run code
  - `Ctrl/Cmd + S`: Save (auto-save also enabled)
  - `Ctrl/Cmd + /`: Toggle comment
  - `Ctrl/Cmd + Z/Y`: Undo/redo
- **Contextual Help:** Hover tooltips, inline hints
- **Smooth Transitions:** 200-300ms easing for panel resizing, modal animations
- **Loading States:** Skeleton screens, spinners for AI responses

---

## **Core Features - MVP (Phase 1)**

### **1. User Management**
- Simple user profile creation (name only)
- User switching (dropdown in UI)
- No passwords/authentication needed
- Each user has independent progress

### **2. Code Editor**
- Monaco Editor with:
  - Syntax highlighting (Python, GDScript, C#)
  - Line numbers
  - Auto-indentation
  - Basic autocomplete
- Resizable panel
- Font size adjustment

### **3. Code Execution**
**Python Execution:**
```rust
// Tauri command
#[tauri::command]
async fn execute_python(code: String) -> Result<ExecutionResult, String> {
    let output = Command::new("python3")
        .arg("-c")
        .arg(&code)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(ExecutionResult {
        stdout: String::from_utf8_lossy(&output.stdout).to_string(),
        stderr: String::from_utf8_lossy(&output.stderr).to_string(),
        exit_code: output.status.code().unwrap_or(-1),
    })
}
```

**Requirements:**
- Capture stdout and stderr separately
- Handle timeouts (5 second max, configurable per lesson)
- Sandbox/isolate execution (see Security section below)
- Show execution time
- Resource limits (memory, CPU)
- Kill runaway processes gracefully

### **Security & Sandboxing**

**Execution Security (Critical):**
- **Process Isolation:** All user code runs in separate processes spawned by Rust backend
- **Timeouts:** Enforce strict execution time limits (default 5s, max 30s for advanced lessons)
- **Resource Limits:**
  - Memory: 256MB for beginner lessons, up to 1GB for advanced
  - CPU: Single core, no infinite loops allowed
  - Disk: No write access by default (read-only workspace)
- **Network Access:** Blocked by default, enabled only for specific networking lessons
- **File System Access:**
  - Phase 1: No file I/O allowed (in-memory execution only)
  - Phase 2: Sandboxed temp directory with quotas (10MB max)
  - Phase 3: Project-based file access within designated workspace
- **System Calls:** Limited syscalls (no exec, fork, network sockets unless explicitly enabled)
- **Input Validation:** Sanitize all user code before execution (prevent shell injection)

**Implementation Approach:**
- Use Rust's `std::process::Command` with restricted permissions
- Consider containerization (Docker) for advanced lessons with network/file access
- Monitor child processes for suspicious behavior
- Log execution attempts for debugging and security auditing

**Risk Mitigation:**
- Clear warnings to users: "This app executes code on your machine. Only run trusted lessons."
- Lesson validation before import (community lessons must be reviewed)
- Option to run in "ultra-safe mode" (cloud execution with stricter limits)

### **4. Console Output Panel**
- Displays stdout (success output)
- Displays stderr (errors) in red
- Clear button
- Scrollable
- Copy output button
- Timestamp for each execution

### **5. AI Coach Interface**
**Dual LLM Provider Support:**

```typescript
// Provider abstraction
interface LLMProvider {
    name: string;
    sendMessage(prompt: string, context: ChatContext): Promise<string>;
    isAvailable(): Promise<boolean>;
    streamMessage?(prompt: string, onChunk: (text: string) => void): Promise<void>;
}

interface ChatContext {
    lessonTitle: string;
    lessonDescription: string;
    userCode: string;
    executionResult?: ExecutionResult;
    chatHistory: Message[];
}

// Ollama implementation
class OllamaProvider implements LLMProvider {
    name = 'Ollama (Local)';
    private baseUrl = 'http://localhost:11434';
    private model = 'codellama:7b';
    
    async sendMessage(prompt: string, context: ChatContext): Promise<string> {
        const fullPrompt = this.buildPrompt(prompt, context);
        const response = await fetch(`${this.baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.model,
                prompt: fullPrompt,
                stream: false
            })
        });
        const data = await response.json();
        return data.response;
    }
    
    async isAvailable(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`, {
                signal: AbortSignal.timeout(2000)
            });
            return response.ok;
        } catch {
            return false;
        }
    }
    
    private buildPrompt(userMessage: string, context: ChatContext): string {
        return `You are a patient coding teacher helping a student learn programming.

Lesson: ${context.lessonTitle}
${context.lessonDescription}

Student's current code:
\`\`\`
${context.userCode}
\`\`\`

${context.executionResult ? `
Execution result:
${context.executionResult.stdout}
${context.executionResult.stderr}
` : ''}

Student's question: ${userMessage}

Provide helpful guidance without giving away the complete solution. Use encouraging language.`;
    }
}

// Claude API implementation
class ClaudeAPIProvider implements LLMProvider {
    name = 'Claude API';
    private apiKey: string;
    
    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }
    
    async sendMessage(prompt: string, context: ChatContext): Promise<string> {
        const messages = this.buildMessages(prompt, context);
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 2048,
                system: this.getSystemPrompt(),
                messages: messages
            })
        });
        const data = await response.json();
        return data.content[0].text;
    }
    
    async isAvailable(): Promise<boolean> {
        return this.apiKey.length > 0;
    }
    
    private getSystemPrompt(): string {
        return `You are a patient, encouraging coding teacher for beginners. Your role is to:
- Provide clear explanations without overwhelming technical jargon
- Give hints rather than complete solutions
- Celebrate small wins and progress
- Explain errors in simple terms
- Ask guiding questions to help students think through problems
- Use analogies and examples when helpful`;
    }
    
    private buildMessages(userMessage: string, context: ChatContext): any[] {
        const messages = [];
        
        // Add chat history
        for (const msg of context.chatHistory) {
            messages.push({
                role: msg.role,
                content: msg.content
            });
        }
        
        // Add current context
        let currentMessage = `Lesson: ${context.lessonTitle}\n\n`;
        
        if (context.userCode) {
            currentMessage += `My code:\n\`\`\`python\n${context.userCode}\n\`\`\`\n\n`;
        }
        
        if (context.executionResult) {
            currentMessage += `Output:\n${context.executionResult.stdout}\n`;
            if (context.executionResult.stderr) {
                currentMessage += `Errors:\n${context.executionResult.stderr}\n`;
            }
            currentMessage += '\n';
        }
        
        currentMessage += userMessage;
        
        messages.push({
            role: 'user',
            content: currentMessage
        });
        
        return messages;
    }
}
```

**AI Coach Features:**
- Chat interface with message history
- Context-aware (knows current lesson, user's code, execution results)
- Can provide:
  - Lesson explanations
  - Hints (graduated difficulty)
  - Error explanations
  - Code review
  - Encouragement
- "Ask for hint" quick button
- "Check my solution" button (validates code)

### **6. Lesson/Challenge System**

**Lesson Structure:**
```typescript
interface Lesson {
    id: number;
    trackId: number;
    title: string;
    description: string; // Markdown supported
    difficulty: number; // 1-10
    starterCode: string; // Pre-filled in editor
    solutionCode: string; // Hidden, for validation
    validationTests: TestCase[]; // Automated checks
    hints: string[]; // Graduated hints
    orderIndex: number;
}

interface TestCase {
    input?: string; // For functions with params
    expectedOutput: string;
    description: string;
}
```

**Example Lesson (Python Track):**
```json
{
    "id": 1,
    "trackId": 1,
    "title": "Your First Variables",
    "description": "Variables are containers that store values. Create three variables:\n- `name` with your name\n- `age` with your age\n- `favorite_color` with your favorite color\n\nThen print them!",
    "difficulty": 1,
    "starterCode": "# Create your variables here\n\n# Print them below\n",
    "solutionCode": "name = \"Ryan\"\nage = 35\nfavorite_color = \"blue\"\nprint(name)\nprint(age)\nprint(favorite_color)",
    "validationTests": [
        {
            "description": "Code should define 'name' variable",
            "check": "variable_exists",
            "variable": "name"
        },
        {
            "description": "Code should print at least 3 lines",
            "check": "output_lines",
            "minLines": 3
        }
    ],
    "hints": [
        "Use the equals sign = to assign values to variables",
        "Strings (text) need to be in quotes: \"like this\"",
        "Use print() to display values: print(name)"
    ]
}
```

**Lesson Navigation:**
- Sidebar showing all lessons in current track
- Visual progress indicators (not started, in progress, completed)
- Lock advanced lessons until basics are done (optional)
- "Next Lesson" button after completion

### **7. Settings Panel**

**LLM Settings:**
- Radio buttons: Local (Ollama) vs Cloud (API)
- Ollama section:
  - Status indicator (green/red dot)
  - "Test Connection" button
  - Model selector dropdown (if multiple models installed)
  - "Install Ollama" button (opens ollama.ai)
- Claude API section:
  - API key input (password field)
  - "Test API Key" button
  - Link to get API key

**Editor Settings:**
- Font size slider (10-24px)
- Theme selector (light/dark)
- Tab size (2/4 spaces)

**User Settings:**
- Current user dropdown
- "Add New User" button
- "Reset Progress" button (with confirmation)

### **8. Progress Tracking**
- Overall progress % for each track
- Lessons completed count
- Total coding time (tracked per session)
- Simple stats dashboard:
  - Lessons completed this week
  - Current streak (days in a row)
  - Total lines of code written

---

## **UI Layout**

```
┌─────────────────────────────────────────────────────────────┐
│ [Code Learning Coach]          User: Ryan ▼    [⚙️ Settings] │
├──────────┬──────────────────────────┬───────────────────────┤
│          │                          │                       │
│ LESSONS  │     CODE EDITOR          │    AI COACH           │
│ SIDEBAR  │                          │                       │
│          │  1  name = "Ryan"        │  💬 Chat Interface    │
│ Python   │  2  age = 35             │                       │
│ Basics   │  3                       │  Coach: Great start!  │
│          │  4  print(name)          │  Try adding a print   │
│ ✅ Vars  │  5  print(age)           │  for age too.         │
│ 📝 If/Else                          │                       │
│ 🔒 Loops │                          │  You: How do I...     │
│          │                          │                       │
│ Godot    │  [▶️ Run Code] [Clear]  │  [Type message...]    │
│ 🔒 Intro │                          │  [Ask for Hint]       │
│          ├──────────────────────────┤  [Check Solution]     │
│          │     CONSOLE OUTPUT       │                       │
│          │                          │                       │
│          │  > Ryan                  │                       │
│          │  > 35                    │                       │
│          │                          │                       │
└──────────┴──────────────────────────┴───────────────────────┘
```

**Panel Resizing:**
- All three panels should be resizable
- Minimum widths enforced
- Responsive layout for smaller screens

---

## **Curriculum Roadmap**

### **Language Progression Strategy**

**Priority Order:**
1. **Python** (Foundation) - Teach core programming concepts
2. **JavaScript/React** (Web Development) - Apply skills to visible, interactive apps
3. **GDScript** (Game Development) - Creative application, visual feedback
4. **C#** (Typed OOP) - Professional desktop/enterprise applications
5. **Ruby** (Elegant Scripting) - Web backends, automation, scripting

**Skill Levels:**
- **Beginner (Lessons 1-15):** Basic syntax, variables, control flow, functions
- **Intermediate (Lessons 16-40):** Data structures, OOP, file I/O, APIs, error handling
- **Advanced (Lessons 41-70):** Design patterns, testing, debugging, performance optimization
- **Professional (Lessons 71+):** Real-world projects, portfolio pieces, best practices

---

### **Track 1: Python Fundamentals** (Priority 1)

**Beginner Module (15 lessons)**

**Module 1: Hello World & Variables** (3 lessons)
1. "The Scroll of Print" - Print statements, seeing output
2. "Variables of Power" - Creating and using variables
3. "The Type Codex" - Strings, integers, floats, booleans

**Module 2: Basic Operations** (3 lessons)
4. "Math Wizard" - Arithmetic operations (+, -, *, /, **)
5. "String Sorcery" - Concatenation, f-strings, string methods
6. "User Input Ritual" - input() function, type conversion

**Module 3: The Conditional Path** (3 lessons)
7. "If Statements" - Basic conditionals, boolean logic
8. "The Fork in the Road" - If/else branching
9. "Multiple Paths" - If/elif/else chains

**Module 4: The Loop of Destiny** (3 lessons)
10. "For Loop Mastery" - Iterating over ranges and lists
11. "While Loop Wisdom" - Condition-based loops
12. "Loop Control Spells" - break, continue, else in loops

**Module 5: The Function Forge** (3 lessons)
13. "Defining Functions" - def, parameters, return values
14. "Function Parameters" - Default args, *args, **kwargs
15. "Real Project: Leave Calculator" - Build a FERS annual leave calculator

**Intermediate Module (25 lessons)**
16-20: Lists, tuples, sets, dictionaries
21-25: List comprehensions, lambda functions, map/filter/reduce
26-30: Object-oriented programming (classes, inheritance, polymorphism)
31-35: File I/O, JSON, CSV handling
36-40: Error handling (try/except), debugging techniques

**Advanced Module (30 lessons)**
41-50: APIs and web requests, working with REST APIs
51-60: Testing (unittest, pytest), TDD principles
61-70: Design patterns, SOLID principles, code architecture

**Professional Projects (10+ lessons)**
71+: Portfolio-worthy apps (CLI tools, data analysis, automation scripts, web scrapers)

---

### **Track 2: JavaScript & React** (Priority 2)

**Beginner Module (15 lessons)**
1-5: JavaScript basics (syntax, variables, functions)
6-10: DOM manipulation, event handling
11-15: Intro to React (components, props, state)

**Intermediate Module (20 lessons)**
16-25: React hooks, lifecycle, routing
26-35: State management (Context, Redux), forms, validation

**Advanced Module (15 lessons)**
36-45: Next.js, API integration, deployment
46-50: Real projects (Todo app, weather app, portfolio site)

---

### **Track 3: GDScript (Godot)** (Priority 3)

**Beginner Module (12 lessons)**
1-4: Godot basics, scene tree, nodes
5-8: GDScript syntax (similar to Python)
9-12: Input handling, simple 2D movement

**Intermediate Module (15 lessons)**
13-20: Collision detection, signals, animations
21-27: UI systems, inventory, game state

**Advanced Module (13 lessons)**
28-35: Save systems, procedural generation
36-40: Real project: 2D RPG or platformer game

---

### **Track 4: C#** (Priority 4)

**Beginner Module (15 lessons)**
1-5: C# syntax, types, variables
6-10: OOP in C#, classes, interfaces
11-15: Collections, LINQ basics

**Intermediate Module (20 lessons)**
16-25: File I/O, serialization, async/await
26-35: .NET libraries, dependency injection

**Advanced Module (15 lessons)**
36-45: ASP.NET Core basics, building APIs
46-50: Real project: Desktop app or web API

---

### **Track 5: Ruby** (Priority 5)

**Beginner Module (12 lessons)**
1-4: Ruby syntax, variables, methods
5-8: Blocks, procs, lambdas
9-12: OOP in Ruby, modules, mixins

**Intermediate Module (15 lessons)**
13-20: Gems, bundler, file I/O
21-27: Rails basics (MVC, routing, ActiveRecord)

**Advanced Module (13 lessons)**
28-35: Testing with RSpec, building APIs
36-40: Real project: Rails web app or CLI tool

---

## **Tauri Commands API**

```rust
// src-tauri/src/main.rs

#[derive(serde::Serialize, serde::Deserialize)]
struct ExecutionResult {
    stdout: String,
    stderr: String,
    exit_code: i32,
    execution_time_ms: u64,
}

#[tauri::command]
async fn execute_python(code: String) -> Result<ExecutionResult, String> {
    // Execute Python code, return results
}

#[tauri::command]
async fn save_user_code(
    user_id: i32,
    lesson_id: i32,
    code: String
) -> Result<(), String> {
    // Save to database
}

#[tauri::command]
async fn load_user_code(
    user_id: i32,
    lesson_id: i32
) -> Result<String, String> {
    // Load from database
}

#[tauri::command]
async fn mark_lesson_complete(
    user_id: i32,
    lesson_id: i32
) -> Result<(), String> {
    // Update progress
}

#[tauri::command]
async fn get_user_progress(user_id: i32) -> Result<UserProgress, String> {
    // Get all progress for user
}

#[tauri::command]
async fn get_lessons_by_track(track_id: i32) -> Result<Vec<Lesson>, String> {
    // Get all lessons in a track
}

#[tauri::command]
async fn test_ollama_connection() -> Result<bool, String> {
    // Check if Ollama is running
}

#[tauri::command]
async fn get_ollama_models() -> Result<Vec<String>, String> {
    // List installed Ollama models
}

#[tauri::command]
async fn send_chat_message(
    user_id: i32,
    lesson_id: i32,
    message: String,
    context: ChatContext
) -> Result<String, String> {
    // Send to active LLM provider
}

#[tauri::command]
async fn get_chat_history(
    user_id: i32,
    lesson_id: i32
) -> Result<Vec<ChatMessage>, String> {
    // Get chat history for lesson
}

#[tauri::command]
async fn save_settings(key: String, value: String) -> Result<(), String> {
    // Save setting to database
}

#[tauri::command]
async fn get_settings() -> Result<HashMap<String, String>, String> {
    // Get all settings
}
```

---

## **File Structure**

```
code-learning-coach/
├── src-tauri/
│   ├── src/
│   │   ├── main.rs              # Tauri setup
│   │   ├── commands/            # Tauri commands
│   │   │   ├── mod.rs
│   │   │   ├── execution.rs     # Code execution
│   │   │   ├── database.rs      # DB operations
│   │   │   └── llm.rs           # LLM integration
│   │   ├── models/              # Data structures
│   │   │   ├── mod.rs
│   │   │   ├── lesson.rs
│   │   │   ├── user.rs
│   │   │   └── progress.rs
│   │   └── db/
│   │       ├── mod.rs
│   │       ├── schema.sql       # SQLite schema
│   │       └── migrations/
│   ├── Cargo.toml
│   └── tauri.conf.json
│
├── src/                         # React frontend
│   ├── components/
│   │   ├── CodeEditor.tsx       # Monaco editor wrapper
│   │   ├── Console.tsx          # Output display
│   │   ├── ChatPanel.tsx        # AI coach chat
│   │   ├── LessonSidebar.tsx    # Lesson navigation
│   │   ├── LessonView.tsx       # Main lesson display
│   │   ├── SettingsPanel.tsx    # Settings UI
│   │   └── ProgressDashboard.tsx
│   ├── services/
│   │   ├── tauri.ts             # Tauri command wrappers
│   │   ├── llm/
│   │   │   ├── provider.ts      # LLM provider interface
│   │   │   ├── ollama.ts        # Ollama implementation
│   │   │   └── claude.ts        # Claude API implementation
│   │   └── storage.ts           # Local storage helpers
│   ├── hooks/
│   │   ├── useCodeExecution.ts
│   │   ├── useLesson.ts
│   │   ├── useChat.ts
│   │   └── useSettings.ts
│   ├── types/
│   │   ├── lesson.ts
│   │   ├── user.ts
│   │   └── chat.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── public/
│   └── lessons/                 # JSON lesson files
│       ├── python-basics.json
│       ├── godot-intro.json
│       └── csharp-basics.json
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## **Development Phases**

### **Phase 1: Core MVP** (First working version)
- [ ] Tauri project setup
- [ ] Basic UI layout (3-panel design)
- [ ] Monaco editor integration
- [ ] Python code execution
- [ ] Console output display
- [ ] SQLite database setup
- [ ] Lesson loading system
- [ ] Basic progress tracking
- [ ] Settings panel (LLM selection)
- [ ] Ollama integration
- [ ] Claude API integration
- [ ] AI coach chat interface
- [ ] First 5 Python lessons

**Success Criteria:** Can complete a Python lesson with AI guidance

### **Phase 2: Enhanced Learning** (Better UX)
- [ ] Hint system
- [ ] Automated code validation
- [ ] Better error messages
- [ ] Progress dashboard
- [ ] Complete Python Basics track (15 lessons)
- [ ] User switching
- [ ] Code snippets/templates
- [ ] Syntax error highlighting

### **Phase 3: Multi-Language Expansion** (Beyond Python)
- [ ] JavaScript/Node.js execution support
- [ ] React preview pane (JSX rendering)
- [ ] JavaScript/React track (15 beginner lessons)
- [ ] GDScript syntax support (Monaco)
- [ ] Godot execution integration
- [ ] GDScript track (12 beginner lessons)
- [ ] Language switcher in UI
- [ ] Unified execution engine (language-agnostic)

### **Phase 4: Professional Languages** (C# & Ruby)
- [ ] C# execution (.NET runtime integration)
- [ ] C# track (15 beginner lessons)
- [ ] Ruby execution support
- [ ] Ruby track (12 beginner lessons)
- [ ] Advanced OOP lessons across all languages
- [ ] Comparative programming lessons (same problem, different languages)

### **Phase 5: Advanced Features** (Polish & Professional Tools)
- [ ] C# support
- [ ] Code formatting (autopep8, gdformat)
- [ ] Export/share code
- [ ] Community lessons (import/export)
- [ ] Achievement system
- [ ] Streaks and gamification
- [ ] Dark/light theme
- [ ] Custom lesson creator

---

## **Non-Functional Requirements**

### **Performance**
- Code execution < 100ms for simple programs
- UI should feel instant (< 50ms interactions)
- Database queries < 10ms
- LLM responses:
  - Ollama: 2-10 seconds depending on hardware
  - Claude API: 1-3 seconds

### **Security**
- Code execution sandboxing (prevent file system access)
- API keys stored securely (OS keychain)
- No network access from executed code

### **Accessibility**
- Keyboard shortcuts for common actions
- High contrast mode support
- Screen reader friendly (future)

### **Error Handling**
- Graceful degradation if LLM unavailable
- Clear error messages for users
- Retry logic for network requests
- Auto-save code every 30 seconds

---

## **Success Metrics**

**For MVP (Phase 1):**
- Users can complete first 5 Python lessons independently
- AI tutor provides helpful (not spoiler) responses 80%+ of the time
- No crashes during normal use
- Install and setup < 5 minutes
- Code execution feedback < 200ms

**Short-term (3 months):**
- Users complete at least 15 lessons (full beginner track)
- Retention: Users return 3+ times per week
- Average session length: 30+ minutes
- 70%+ lesson completion rate (started → finished)
- AI tutor satisfaction rating: 4+/5 stars

**Long-term (6-12 months):**
- Users complete 40+ lessons (reach intermediate level)
- 30%+ of users complete at least one professional project lesson
- Users build portfolio-worthy projects using the app
- Time to lesson completion decreases as users progress (learning curve evidence)
- Users successfully apply for entry-level developer positions (testimonials)
- Community engagement: Users share projects, lessons, and tips

**Professional Proficiency Indicators:**
- Users can build full applications from scratch without hints
- Users understand debugging, testing, and code architecture
- Users contribute to open-source projects or freelance work
- Users demonstrate mastery across multiple languages (2+)

---

## **Future Considerations** (Post-MVP)

1. **Web Hosting:** Convert to web app with backend API
2. **Multi-language UI:** Support Spanish, etc.
3. **Mobile Version:** iOS/Android (view-only?)
4. **Collaborative Learning:** Share code with others
5. **Video Tutorials:** Embedded video lessons
6. **Integration with Real IDEs:** VS Code extension?
7. **Advanced Tracks:**
   - Data structures & algorithms
   - Game AI programming
   - Federal benefits calculator (your domain!)
   - Web development (HTML/CSS/JS)

---

## **Open Questions to Decide**

1. **Lesson Format:** JSON files vs database? (Suggest: JSON for easy editing, import to DB on startup)
2. **Code Validation:** Run test cases vs LLM validation vs both?
3. **Ollama Model:** Start with `codellama:7b` or `llama3.2:8b`?
4. **First Run:** Show tutorial lesson before allowing free navigation?
5. **Progress Sync:** Local only or optional cloud backup? (Suggest: local only for MVP)
6. **Lesson Authoring:** Build UI for creating lessons or edit JSON files?

---

## **Getting Started Checklist**

For Claude Code to begin:

- [ ] Initialize Tauri project: `npm create tauri-app@latest`
- [ ] Set up React + TypeScript + Tailwind
- [ ] Create SQLite schema and migrations
- [ ] Implement basic Tauri commands (execute_python, save_code)
- [ ] Build 3-panel layout
- [ ] Integrate Monaco Editor
- [ ] Create first 5 Python lessons (JSON files)
- [ ] Implement Ollama provider
- [ ] Implement Claude API provider
- [ ] Build settings panel
- [ ] Test complete user flow: lesson → code → run → chat → complete

---

## **Additional Notes**

- Keep dependencies minimal (faster builds, fewer conflicts)
- Write tests for Tauri commands (Rust unit tests)
- Document code thoroughly (comments for kids learning later)
- Use TypeScript strictly (catch errors early)
- Git workflow: main branch for stable, dev for experiments

---

This spec should give Claude Code everything it needs to start building! Let me know if you want me to:
1. Expand any section
2. Add more technical details
3. Create the initial lesson JSON files
4. Write specific code examples for tricky parts
