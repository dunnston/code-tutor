# Database Import Scripts

This directory contains scripts to import all course framework data into a SQLite database.

## Quick Start

```bash
# Make sure you're in the import-scripts directory
cd course-framework-output/import-scripts

# Run the import script
python import_all.py
```

This will:
1. Create a new SQLite database: `course_database.db`
2. Run the schema from `database/schema.sql`
3. Import all seed data
4. Import all concept implementations
5. Import all lessons
6. Verify the import with statistics

## Requirements

- Python 3.7 or higher
- No external dependencies (uses only standard library)

## What Gets Imported

### Seed Data
- ✅ 3 Categories (Backend, Game Dev, Frontend)
- ✅ 3 Skill Levels (Beginner, Intermediate, Advanced)
- ✅ 5 Languages (Python, GDScript, C#, JavaScript, Ruby)
- ✅ 34 Concepts (Fundamentals through Advanced)
- ✅ 12 Courses (4 beginner, 8 intermediate/advanced)

### Concept Implementations
- ✅ Python: 34 concepts (100% complete)
- ✅ GDScript: 12 concepts (beginner fundamentals)
- ✅ JavaScript: 5 concepts (basic fundamentals)
- ⏳ C#: 0 concepts (planned)

### Lessons
- ✅ Python Fundamentals: 30 lessons (COMPLETE)
- ✅ GDScript Basics: 5 lessons (20% complete)
- ✅ JavaScript Fundamentals: 5 lessons (17% complete)
- ✅ C# Fundamentals: 5 lessons (17% complete)

**Total: 45 complete lessons**

## Output

The script creates a file: `course-framework-output/course_database.db`

You can inspect it with:

```bash
sqlite3 course_database.db

# Then run SQL queries:
sqlite> SELECT * FROM courses;
sqlite> SELECT COUNT(*) FROM lessons WHERE course_id = 'python-fundamentals';
sqlite> .quit
```

## Troubleshooting

### "File not found" errors
Make sure you're running the script from the `import-scripts` directory, or the paths might be wrong.

### "Table already exists" errors
The schema uses `CREATE TABLE IF NOT EXISTS` so this shouldn't happen. If it does, delete `course_database.db` and run again.

### Import count is 0
Check that the JSON files exist in the correct directories and contain valid JSON.

## Integration with Tauri App

To use this database in your Tauri app:

1. Run the import script to create `course_database.db`
2. Copy `course_database.db` to your Tauri app's resources
3. Update your Tauri backend to read from this database instead of static JSON files
4. Create Rust structs matching the database schema
5. Use `rusqlite` or another SQLite library to query lessons

Example Rust query:
```rust
use rusqlite::{Connection, Result};

fn get_course_lessons(course_id: &str) -> Result<Vec<Lesson>> {
    let conn = Connection::open("course_database.db")?;
    let mut stmt = conn.prepare(
        "SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index"
    )?;
    // ... map to Lesson struct
}
```

## Next Steps

1. ✅ Import completed Python lessons
2. ⏳ Create remaining JavaScript/C#/GDScript lessons
3. ⏳ Update Tauri app to use database
4. ⏳ Create dashboard UI for course selection
5. ⏳ Implement progress tracking

## Files in This Directory

- `import_all.py` - Main import script (runs everything)
- `README.md` - This file

## Notes

- The import is idempotent - running it multiple times won't create duplicates
- Uses `INSERT OR REPLACE` to update existing records
- Preserves existing user progress data (doesn't touch user tables)
- Safe to re-run after adding new lessons
