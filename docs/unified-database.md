# Unified Database Architecture

## Overview

Code Tutor uses a **single unified SQLite database** for all game content, including:
- Multiple choice questions (MCQ)
- Custom enemies and bosses
- Equipment items and consumables
- Dungeon levels and nodes
- Player progress and achievements

This ensures that any content added through the **Dungeon Editor** is immediately available in the **Dungeon Crawler** game, and vice versa.

## Database Location

The SQLite database is located at:
```
{AppData}/code-tutor/code_tutor.db
```

## Key Tables

### Multiple Choice Questions (`mcq_questions`)

Schema:
```sql
CREATE TABLE mcq_questions (
    id TEXT PRIMARY KEY,
    question_text TEXT NOT NULL,
    explanation TEXT,
    options TEXT NOT NULL,              -- JSON array of answer options
    correct_answer_index INTEGER NOT NULL,
    difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard', 'expert')),
    topic TEXT,                          -- e.g., "variables", "loops", "functions"
    language TEXT,                       -- e.g., "python", "javascript", "gdscript"
    tags TEXT,                           -- JSON array of tags
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
```

### Custom Enemies (`custom_enemies`)

Schema:
```sql
CREATE TABLE custom_enemies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    enemy_type TEXT CHECK(enemy_type IN ('regular', 'boss', 'elite')),
    level INTEGER NOT NULL DEFAULT 1,
    base_health INTEGER NOT NULL,
    base_attack INTEGER NOT NULL,
    base_defense INTEGER NOT NULL,
    image_path TEXT,
    attack_animation TEXT,              -- JSON with animation data
    attacks TEXT NOT NULL,              -- JSON array of attack objects
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
```

## Adding Content

### Through the Dungeon Editor

1. Navigate to the Dungeon Editor in the app
2. Use the management interfaces:
   - **Question Manager**: Create, edit, or import questions
   - **Enemy Manager**: Create or modify enemies
   - **Item Manager**: Add equipment or consumables

All changes are immediately saved to the database and available in the game.

### Bulk Importing Questions

The system supports bulk import of questions from markdown files:

1. **Via UI**: Click "Bulk Import (300 Questions)" in the Question Manager
2. **Format**: Questions must follow this markdown pattern:
   ```markdown
   1. Question text here?
      a) Option A
      b) Option B
      c) Option C
      d) Option D
      **Answer: a**
   ```

3. **File Location**: Place markdown file at `docs/multiple-choice.md`

### Programmatically

Use the Tauri commands from your TypeScript/React code:

```typescript
import { invoke } from '@tauri-apps/api/core';

// Add a single question
await invoke('save_mcq_question', {
  question: {
    id: 'my-question-001',
    questionText: 'What is a variable?',
    options: JSON.stringify(['A container', 'A function', 'A loop', 'A class']),
    correctAnswerIndex: 0,
    difficulty: 'easy',
    topic: 'variables',
    language: 'python',
    tags: JSON.stringify(['basics']),
  }
});

// Bulk import from parsed markdown
await invoke('bulk_import_mcq_questions', {
  questions: parsedQuestions
});

// Import directly from markdown file
await invoke('import_markdown_mcq_questions');
```

## Accessing Content in Game

The dungeon crawler automatically queries the database for:
- Questions matching the player's current difficulty level
- Enemies appropriate for the dungeon floor
- Available loot items from the item pool

No manual synchronization is needed - the game always sees the latest database state.

## Data Flow

```
┌─────────────────┐
│ Dungeon Editor  │──┐
│  - Questions    │  │
│  - Enemies      │  │
│  - Items        │  │
└─────────────────┘  │
                     ▼
             ┌───────────────┐
             │ Unified DB    │
             │ (SQLite)      │
             └───────────────┘
                     ▲
┌─────────────────┐  │
│ Dungeon Crawler │──┘
│  - Gameplay     │
│  - Progress     │
│  - Achievements │
└─────────────────┘
```

## Best Practices

1. **Use the Editor First**: Create and test content in the editor before using it in the game
2. **Unique IDs**: Always use unique, descriptive IDs (e.g., `python-var-001`, not `question1`)
3. **Proper Difficulty Tags**: Ensure questions have correct difficulty levels for balanced gameplay
4. **Topic Categorization**: Assign accurate topics to enable filtered question selection
5. **Test in Game**: After adding content, test it in the dungeon crawler to ensure it works as expected

## Migrations

Database schema changes are managed through migration files in:
```
src-tauri/migrations/
```

Key migrations:
- `032_custom_enemies.sql` - Enemy system
- `033_mcq_questions.sql` - Question system

New migrations are automatically applied on app startup.

## Troubleshooting

### Questions not appearing in game
- Check that questions have the correct `difficulty` and `language` values
- Verify the question exists: Open Question Manager and search for it
- Check browser/app console for database errors

### Import fails
- Ensure markdown file is at `docs/multiple-choice.md`
- Verify markdown format matches the expected pattern
- Check for special characters or formatting issues in questions

### Duplicate content
- The import system automatically skips existing IDs
- Use unique prefixes for custom questions (e.g., `custom-var-001`)
- Imported bulk questions use format: `python-{difficulty}-{number}`

## API Reference

### Tauri Commands

**MCQ Questions:**
- `save_mcq_question(question)` - Create or update a question
- `load_mcq_question(questionId)` - Load a single question
- `list_mcq_questions(filters)` - List questions with optional filters
- `delete_mcq_question(questionId)` - Delete a question
- `duplicate_mcq_question(questionId)` - Duplicate a question
- `bulk_import_mcq_questions(questions)` - Import multiple questions
- `import_markdown_mcq_questions()` - Import from markdown file
- `get_random_mcq_question(filters)` - Get random question matching filters

**Enemies:**
- `save_custom_enemy(enemy)` - Create or update an enemy
- `load_custom_enemy(enemyId)` - Load a single enemy
- `list_custom_enemies(filters)` - List enemies
- `delete_custom_enemy(enemyId)` - Delete an enemy

**Items:**
- `list_equipment_items()` - Get all equipment items
- `list_consumable_items()` - Get all consumable items
- `list_all_loot_items()` - Get combined loot pool

---

**Remember**: There is only ONE database. Any changes you make in the editor are immediately reflected in the game. No exports, imports, or syncing needed!
