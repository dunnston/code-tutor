# Code Tutor - Project Guidelines

## Technology Stack
- **Frontend**: React 18+ with TypeScript
- **Backend**: Tauri 2.x (Rust)
- **Styling**: Tailwind CSS with custom design tokens
- **Editor**: Monaco Editor (VS Code engine)
- **AI**: Dual LLM support (Ollama local + Claude API)
- **Build**: Vite
- **Target**: Cross-platform desktop (Windows/Mac/Linux) + Web-ready

## Git Workflow
- **NEVER commit directly to main branch**
- Always work on feature branches: `git checkout -b feature/descriptive-name`
- Commit frequently with clear messages
- Merge to main via PR/merge only
- Branch naming: `feature/`, `fix/`, `refactor/`

## Project Tracking
- **Check and update PROJECT_PLAN.md as you complete tasks**
- Mark tasks with `[x]` when done
- Add new discovered tasks as they emerge
- Keep the plan current and accurate

## Design System

### Colors
- **Background**: Dark navy/slate (`#1a1d29`, `#0f1117`)
- **Surface**: Lighter slate (`#252837`, `#2a2f42`)
- **Text Primary**: Near-white (`#e5e7eb`, `#f3f4f6`)
- **Text Secondary**: Gray (`#9ca3af`, `#6b7280`)
- **Accent**: Orange (`#fb923c`, `#f59e0b`) for CTAs, highlights
- **Success**: Green (`#22c55e`)
- **Error**: Red (`#ef4444`)
- **Code Editor**: Dark theme matching background

### UI Layout
- Split panel design: **Lesson content (left) | Code editor + console (right)**
- Responsive breakpoints for smaller screens (stack vertically)
- Consistent spacing using Tailwind scale (4, 8, 16, 24, 32, 48px)
- Action buttons: Submit (accent), Run (secondary), Solution (gated), Reset
- Progress indicators visible at all times

## Architecture Principles

### File Structure
```
src/
├── components/       # Reusable UI components
│   ├── editor/      # Monaco editor wrapper
│   ├── console/     # Console output display
│   ├── lesson/      # Lesson content renderer
│   └── ui/          # Button, Card, etc.
├── features/        # Feature-based modules
│   ├── lessons/     # Lesson system
│   ├── ai-tutor/    # AI integration
│   ├── progress/    # Progress tracking
│   └── execution/   # Code execution engine
├── lib/             # Utilities, helpers
├── types/           # TypeScript types
└── hooks/           # Custom React hooks
```

### Best Practices
- **Separation of Concerns**: Keep business logic separate from UI
- **Component Composition**: Build small, reusable components
- **Type Safety**: Use TypeScript strictly (no `any` unless absolutely necessary)
- **Error Handling**: Always handle errors gracefully with user feedback
- **Performance**: Lazy load heavy components (Monaco, language parsers)
- **Accessibility**: Use semantic HTML, ARIA labels, keyboard navigation

### Code Execution Security
- **Sandboxed Execution**: All code runs in isolated Rust backend processes
- **Timeouts**: Enforce execution time limits (e.g., 5 seconds)
- **Resource Limits**: Memory and CPU constraints
- **No Network Access**: Block network calls from user code (configurable per lesson)
- **Input Validation**: Sanitize all user code before execution

## AI Tutor Behavior

### Core Principles
- **Socratic Method**: Ask guiding questions, never give direct answers
- **Adaptive**: Adjust help level based on user progress and struggle patterns
- **Context-Aware**: AI sees user's code, console output, and lesson requirements
- **Encouraging**: Positive reinforcement, celebrate small wins
- **Hint Progression**: Start vague, get more specific if user is stuck

### Example Interactions
**Bad**: "The answer is `print('Hello')`"
**Good**: "What command do you think displays text to the console? Look at the lesson example."

**Bad**: "You're missing a colon on line 3"
**Good**: "Python requires special punctuation at the end of `if` statements. Check line 3."

### AI Integration Points
- Chat interface in IDE (toggleable sidebar)
- Contextual hints when user requests help
- Automatic detection of prolonged struggle (offer help proactively after X minutes)
- Post-lesson feedback and suggestions

## IDE Simplicity (Phase 1)
- **Single file focus**: No file tree initially
- **Inline console**: Output appears below editor
- **Basic actions**: Run, Submit, Reset code
- **No debugging tools yet**: Use `print()` statements for debugging

### Advanced Features (Unlocked Later)
- File explorer for multi-file projects (Phase 6)
- Debugging tools (breakpoints, step-through)
- Code completion beyond Monaco defaults
- Git integration

## Testing Strategy
- Unit tests for utilities and business logic
- Integration tests for AI tutor responses
- E2E tests for critical user flows (lesson completion)
- Manual testing in Godot/Tauri for platform-specific features

## Performance Targets
- App launch: < 2 seconds
- Editor load: < 500ms
- Code execution: < 100ms overhead (excluding user code runtime)
- AI response: < 3 seconds

## Naming Conventions
- **Components**: PascalCase (`LessonPanel.tsx`)
- **Utilities**: camelCase (`executeCode.ts`)
- **Types**: PascalCase with `Type` suffix (`LessonType`, `UserProgressType`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_EXECUTION_TIME`)
- **CSS classes**: Tailwind utilities (avoid custom CSS unless necessary)

## Don't Drift
- Stay focused on learn-by-doing pedagogy
- Resist feature creep (check PROJECT_PLAN.md phases)
- Keep UI clean and uncluttered
- Prioritize Python track first, then expand languages
- Always ask: "Does this help the user learn faster?"

---

**Remember**: Clean code today = maintainable code tomorrow. Write for the next developer (which might be you in 3 months).
