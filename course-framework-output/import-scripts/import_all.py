#!/usr/bin/env python3
"""
Complete Database Import Script
Imports all course framework data into SQLite database
"""

import sqlite3
import json
import os
from pathlib import Path

# Get script directory
SCRIPT_DIR = Path(__file__).parent
BASE_DIR = SCRIPT_DIR.parent
DB_PATH = BASE_DIR / 'course_database.db'

def create_database():
    """Create database from schema.sql"""
    print("📋 Creating database schema...")

    schema_path = BASE_DIR / 'database' / 'schema.sql'
    with open(schema_path, 'r', encoding='utf-8') as f:
        schema_sql = f.read()

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.executescript(schema_sql)
    conn.commit()
    conn.close()

    print("✅ Database schema created successfully!")

def import_json_file(table_name, json_path):
    """Import JSON array data into a table"""
    print(f"📥 Importing {json_path.name} into {table_name}...")

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if not data:
        print(f"⚠️  No data in {json_path.name}")
        return 0

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Get column names from first item
    columns = list(data[0].keys())
    placeholders = ','.join(['?' for _ in columns])
    column_names = ','.join(columns)

    # Insert each record
    for item in data:
        values = [item.get(col) for col in columns]
        cursor.execute(
            f"INSERT OR REPLACE INTO {table_name} ({column_names}) VALUES ({placeholders})",
            values
        )

    conn.commit()
    count = len(data)
    conn.close()

    print(f"✅ Imported {count} records into {table_name}")
    return count

def import_seed_data():
    """Import all seed data"""
    print("\n📦 Importing seed data...")

    seed_dir = BASE_DIR / 'seed-data'
    total = 0

    # Import in dependency order
    imports = [
        ('categories', 'categories.json'),
        ('skill_levels', 'skill_levels.json'),
        ('languages', 'languages.json'),
        ('concepts', 'concepts.json'),
        ('courses', 'courses.json'),
    ]

    for table, filename in imports:
        json_path = seed_dir / filename
        if json_path.exists():
            total += import_json_file(table, json_path)
        else:
            print(f"⚠️  File not found: {filename}")

    return total

def import_concept_implementations():
    """Import all concept implementations"""
    print("\n📚 Importing concept implementations...")

    impl_dir = BASE_DIR / 'concept-implementations'
    total = 0

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Process each language directory
    for lang_dir in impl_dir.iterdir():
        if not lang_dir.is_dir():
            continue

        language_id = lang_dir.name
        print(f"  Processing {language_id}...")

        # Process each JSON file in the language directory
        for json_file in lang_dir.glob('*.json'):
            with open(json_file, 'r', encoding='utf-8') as f:
                implementations = json.load(f)

            for impl in implementations:
                # Convert common_mistakes from JSON string to proper JSON
                common_mistakes_json = json.dumps(
                    json.loads(impl['common_mistakes']) if isinstance(impl['common_mistakes'], str) else impl['common_mistakes']
                )

                cursor.execute("""
                    INSERT OR REPLACE INTO concept_implementations
                    (concept_id, language_id, explanation, code_example, syntax_notes, common_mistakes)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (
                    impl['concept_id'],
                    impl['language_id'],
                    impl['explanation'],
                    impl['code_example'],
                    impl['syntax_notes'],
                    common_mistakes_json
                ))
                total += 1

    conn.commit()
    conn.close()

    print(f"✅ Imported {total} concept implementations")
    return total

def import_lessons():
    """Import all lessons"""
    print("\n📖 Importing lessons...")

    lessons_dir = BASE_DIR / 'lessons'
    total = 0

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Map old trackId to new course_id
    track_to_course = {
        1: 'python-fundamentals',
        2: 'godot-basics',
        3: 'ruby-fundamentals',  # If you have Ruby
        4: 'javascript-fundamentals',
        5: 'csharp-fundamentals'
    }

    # Process each course directory
    for course_dir in lessons_dir.iterdir():
        if not course_dir.is_dir():
            continue

        course_id = course_dir.name
        print(f"  Processing {course_id}...")

        # Process each lesson JSON file
        for json_file in sorted(course_dir.glob('*.json')):
            with open(json_file, 'r', encoding='utf-8') as f:
                lesson = json.load(f)

            # Map trackId to course_id if present
            if 'trackId' in lesson and 'course_id' not in lesson:
                lesson['course_id'] = track_to_course.get(lesson['trackId'], course_id)
            elif 'course_id' not in lesson:
                lesson['course_id'] = course_id

            # Generate lesson ID if not present
            if 'id' not in lesson or isinstance(lesson['id'], int):
                # Create string ID from course and title
                title_slug = lesson['title'].lower().replace(' ', '-').replace(':', '')
                lesson_id = f"{lesson['course_id']}-{title_slug}"
            else:
                lesson_id = lesson['id']

            # Convert JSON fields
            validation_tests_json = json.dumps(lesson.get('validationTests', []))
            hints_json = json.dumps(lesson.get('hints', []))
            learning_objectives_json = json.dumps(lesson.get('learningObjectives', []))
            tags_json = json.dumps(lesson.get('tags', []))

            cursor.execute("""
                INSERT OR REPLACE INTO lessons
                (id, course_id, concept_id, title, subtitle, description, order_index,
                 starter_code, solution_code, validation_tests, hints,
                 estimated_minutes, estimated_time, xp_reward, difficulty,
                 learning_objectives, tags, next_lesson_id, previous_lesson_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                lesson_id,
                lesson['course_id'],
                lesson.get('concept_id'),
                lesson['title'],
                lesson.get('subtitle'),
                lesson['description'],
                lesson.get('order_index', total),
                lesson.get('starterCode'),
                lesson.get('solutionCode'),
                validation_tests_json,
                hints_json,
                lesson.get('estimatedMinutes'),
                lesson.get('estimatedTime'),
                lesson.get('xpReward', 100),
                lesson.get('difficulty', 1),
                learning_objectives_json,
                tags_json,
                lesson.get('nextLessonId'),
                lesson.get('previousLessonId')
            ))
            total += 1

    conn.commit()
    conn.close()

    print(f"✅ Imported {total} lessons")
    return total

def verify_import():
    """Verify the import was successful"""
    print("\n🔍 Verifying import...")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    tables = [
        'categories',
        'skill_levels',
        'languages',
        'concepts',
        'courses',
        'concept_implementations',
        'lessons'
    ]

    print("\n📊 Database Statistics:")
    for table in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        count = cursor.fetchone()[0]
        print(f"  {table:25} {count:4} records")

    conn.close()

def main():
    """Main import process"""
    print("=" * 60)
    print("  Course Framework Database Import")
    print("=" * 60)

    try:
        # Create database
        create_database()

        # Import data
        import_seed_data()
        import_concept_implementations()
        import_lessons()

        # Verify
        verify_import()

        print("\n" + "=" * 60)
        print("✅ Import completed successfully!")
        print(f"📁 Database location: {DB_PATH}")
        print("=" * 60)

    except Exception as e:
        print(f"\n❌ Error during import: {e}")
        import traceback
        traceback.print_exc()
        return 1

    return 0

if __name__ == '__main__':
    exit(main())
