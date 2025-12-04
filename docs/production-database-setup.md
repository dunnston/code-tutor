# Production Database Setup

## Overview

For production builds of Code Tutor, you'll want to ensure all 300+ MCQ questions are available to users immediately without requiring manual imports. This document outlines the recommended approach.

## Current Status

✅ Questions imported in development database
✅ Import functions available via Tauri commands
✅ Database structure and migrations in place

## Production Strategy: Pre-Seeded Database

### Recommended Approach

1. **Development Phase** (Already Done!)
   - Import all 300 questions using the Question Manager
   - Your local database now has all questions at: `%AppData%/code-tutor/code-tutor.db`

2. **Create Production Seed File**

   Option A: Export your current database
   ```bash
   # Copy your dev database as a production seed
   cp "%AppData%/code-tutor/code-tutor.db" "src-tauri/migrations/seed_database.db"
   ```

   Option B: Create a SQL dump
   ```bash
   sqlite3 "%AppData%/code-tutor/code-tutor.db" .dump > src-tauri/migrations/mcq_seed.sql
   ```

3. **Bundle With Tauri**

   **Method 1: Bundle the entire database**

   In `src-tauri/tauri.conf.json`:
   ```json
   {
     "bundle": {
       "resources": [
         "migrations/seed_database.db"
       ]
     }
   }
   ```

   Then in `db.rs`:
   ```rust
   // On first launch, if database is empty, copy from bundled seed
   if question_count == 0 {
       let seed_db = include_bytes!("../migrations/seed_database.db");
       std::fs::write(&db_path, seed_db)?;
   }
   ```

   **Method 2: Bundle markdown and auto-import**

   In `src-tauri/tauri.conf.json`:
   ```json
   {
     "bundle": {
       "resources": [
         "../../docs/multiple-choice.md"
       ]
     }
   }
   ```

   Update `db.rs` to auto-import on first launch:
   ```rust
   if question_count == 0 {
       log::info!("Attempting auto-import of MCQ questions...");
       if let Err(e) = crate::mcq_commands::import_markdown_mcq_questions(app.clone()) {
           log::warn!("Failed to auto-import questions: {}", e);
       }
   }
   ```

   **Method 3: SQL seed file (Current approach)**

   Create a migration file with all question INSERT statements:
   ```sql
   -- src-tauri/migrations/034_seed_mcq_questions.sql
   INSERT OR IGNORE INTO mcq_questions (...) VALUES (...);
   -- (repeat for all 300 questions)
   ```

## Testing Production Build

1. **Delete your local database** to simulate first-time user:
   ```bash
   rm "%AppData%/code-tutor/code-tutor.db"
   ```

2. **Build and run production version:**
   ```bash
   npm run tauri build
   ```

3. **Launch the app** and verify:
   - Open Question Manager
   - You should see all 300 questions
   - Check that questions appear in dungeon crawler

## Recommended: Method 1 (Pre-populated Database)

This is the simplest and fastest approach:

### Step-by-Step

1. **Export current database with questions:**
   ```bash
   # Windows PowerShell
   Copy-Item "$env:APPDATA\code-tutor\code-tutor.db" "src-tauri\seed_database.db"
   ```

2. **Update `db.rs`** to use seed on first launch:
   ```rust
   pub fn initialize_database(app: &AppHandle) -> Result<(), String> {
       let db_path = get_db_path(app)?;

       // Check if database exists
       if !db_path.exists() {
           log::info!("First launch - copying seed database...");

           // Copy bundled seed database
           let seed_data = include_bytes!("../seed_database.db");
           std::fs::write(&db_path, seed_data)
               .map_err(|e| format!("Failed to write seed database: {}", e))?;

           log::info!("Seed database copied successfully");
       }

       // Rest of initialization...
   }
   ```

3. **Bundle in Tauri config:**
   ```json
   {
     "bundle": {
       "resources": ["seed_database.db"]
     }
   }
   ```

### Advantages
- ✅ Instant availability - no import needed
- ✅ Consistent across all users
- ✅ No network/file access required
- ✅ Users can start playing immediately

### Disadvantages
- ⚠️ Increases app bundle size (~500KB for database)
- ⚠️ Updates require new build/release

## Alternative: First-Launch Auto-Import

If you prefer to keep bundle size minimal:

1. **Bundle only the markdown file** (smaller, ~100KB)
2. **Auto-import on first launch** using the existing import function
3. **Show loading screen** during first-time setup

This gives users the same experience but with a 2-3 second setup on first launch.

## Updating Questions

### For Pre-Seeded Database
1. Update questions in dev environment
2. Export new seed database
3. Create new app release
4. Users update app

### For Auto-Import Method
1. Host markdown file on server
2. Add "Download Latest Questions" feature
3. Users can update without app update

## Recommendations

**For MVP/Beta Launch:** Use **Method 1 (Pre-seeded database)**
- Fastest user experience
- Most reliable
- Simple to implement

**For Long-term:** Consider adding:
- Question update feature (download new questions)
- User-generated content (community questions)
- Cloud sync (optional)

---

**Current Status:** Your development database has all questions. Choose a bundling strategy above and implement it before your production release.

**File to Copy:** `%AppData%\code-tutor\code-tutor.db` → `src-tauri/seed_database.db`
