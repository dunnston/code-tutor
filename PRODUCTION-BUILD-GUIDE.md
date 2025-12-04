# Production Build Guide - Bundling Your Content

## Overview

Your Code Tutor app now includes **everything** from your development database in production builds!

When users install your app, they'll automatically get:
- ✅ All 300+ MCQ questions
- ✅ Custom enemies and bosses
- ✅ Equipment items and consumables
- ✅ Dungeon levels and content
- ✅ Everything you've created in the editor!

## Quick Start

### Step 1: Run the App and Add Your Content

```bash
npm run tauri dev
```

1. Import the 300 questions (already done!)
2. Add any custom enemies in the Enemy Manager
3. Add any custom items in the Item Manager
4. Create dungeon levels in the Level Editor
5. Test everything in the dungeon crawler

### Step 2: Export Your Database

Run the export script from the project root:

```powershell
.\export-database-for-production.ps1
```

This script will:
- 🔍 Find your development database
- 📊 Show you what's inside (question count, items, etc.)
- 💾 Copy it to `src-tauri\seed_database.db`
- ✅ Prepare it for production bundling

### Step 3: Build for Production

```bash
npm run tauri build
```

The build process will:
1. Bundle your seed database with the app
2. Create installers for Windows/Mac/Linux
3. Compress everything into distribution packages

### Step 4: Test the Production Build

**Important:** Test before distributing!

1. **Delete your dev database** (to simulate first-time user):
   ```powershell
   Remove-Item "$env:APPDATA\code-tutor\code-tutor.db"
   ```

2. **Run the production build**:
   - Navigate to `src-tauri\target\release\`
   - Run `Code Tutor.exe`

3. **Verify content**:
   - Open Question Manager → Should see all 300 questions
   - Open Enemy Manager → Should see your custom enemies
   - Play dungeon crawler → Everything should work!

### Step 5: Distribute to Users

Your production installers are in:
```
src-tauri/target/release/bundle/
```

Files you'll find:
- **Windows**: `.msi` installer
- **Mac**: `.dmg` disk image
- **Linux**: `.deb`, `.AppImage`

## How It Works

### Development Mode (`npm run tauri dev`)
- Creates fresh database with migrations
- You add content manually via the app
- Database stored at: `%APPDATA%\code-tutor\code-tutor.db`

### Production Mode (`npm run tauri build`)
- Bundles your seed database
- On first launch, copies seed to user's AppData
- Users get all your content immediately!

### The Magic (Technical Details)

1. **Export Script** ([export-database-for-production.ps1](export-database-for-production.ps1))
   - Copies `%APPDATA%\code-tutor\code-tutor.db` → `src-tauri\seed_database.db`

2. **Build Process**
   - `include_bytes!("../seed_database.db")` embeds database in binary
   - Configured in [tauri.conf.json](src-tauri/tauri.conf.json#L38-40)

3. **First Launch** ([db.rs](src-tauri/src/db.rs#L26-52))
   - Detects if database doesn't exist
   - Copies bundled seed to AppData
   - Runs migrations (for future updates)
   - User starts playing immediately!

## Updating Content for Future Releases

### To add new questions/content:

1. **Update in dev mode**:
   ```bash
   npm run tauri dev
   # Add new content via editors
   ```

2. **Re-export database**:
   ```powershell
   .\export-database-for-production.ps1
   ```

3. **Build new version**:
   ```bash
   npm run tauri build
   ```

4. **Increment version** in `src-tauri/tauri.conf.json`:
   ```json
   "version": "0.2.0"
   ```

5. **Distribute updated installer**

### For existing users:

Current approach: Users keep their database (preserves progress)
- New users get the updated seed database
- Existing users keep their data + progress

**Future enhancement**: Add "Download Latest Questions" feature to update content without reinstalling.

## Database Size Impact

Current estimated sizes:
- Empty database: ~50 KB
- With 300 questions: ~200 KB
- With questions + enemies + items: ~500 KB
- **Total app size increase: < 1 MB** ✅

This is negligible compared to the app size (~50-100 MB).

## Troubleshooting

### "Seed database not found" during build

**Solution**: Run the export script first:
```powershell
.\export-database-for-production.ps1
```

### Production build has no questions

**Possible causes**:
1. Export script wasn't run
2. Dev database is empty (run the app first!)
3. Seed database file is corrupted

**Fix**:
1. Run dev mode and verify content exists
2. Run export script again
3. Rebuild

### Users report missing content

**Check**:
1. Did you run the export script before building?
2. Is `src-tauri\seed_database.db` > 100 KB?
3. Did the build complete without errors?

### Content updates not appearing

**Remember**: Existing users keep their old database!

**Options**:
- Provide migration script
- Add "Reset Database" feature (loses progress)
- Add "Download Updates" feature (recommended)

## Files Modified for This Feature

- ✅ [src-tauri/src/db.rs](src-tauri/src/db.rs) - Seed database loading logic
- ✅ [src-tauri/tauri.conf.json](src-tauri/tauri.conf.json) - Bundle configuration
- ✅ [export-database-for-production.ps1](export-database-for-production.ps1) - Export script
- ✅ [src-tauri/seed_database.db](src-tauri/seed_database.db) - Your content (after export)

## Best Practices

### Before Every Release

- [ ] Test all content in dev mode
- [ ] Run export script
- [ ] Build production version
- [ ] Delete dev database
- [ ] Test production build (fresh install simulation)
- [ ] Verify all content appears
- [ ] Run through dungeon crawler gameplay
- [ ] Check Question/Enemy/Item managers
- [ ] Distribute!

### Version Control

**DO commit**:
- ✅ Export script
- ✅ Database placeholder
- ✅ Tauri config changes
- ✅ db.rs changes

**DON'T commit**:
- ❌ `src-tauri/seed_database.db` (if > 1 MB or contains user data)
- ❌ Your personal dev database

**Optional**: Add to `.gitignore`:
```
src-tauri/seed_database.db
```

Then share seed database via:
- Build artifacts
- Separate repository
- Build server

## Support

If users report issues:

1. **Check their database**:
   - Location: `%APPDATA%\code-tutor\code-tutor.db`
   - Size should be > 100 KB

2. **Verify seed was copied**:
   - Check app logs (first launch should show "Seed database copied")

3. **Nuclear option**: Delete and reinstall
   - User loses progress but gets fresh content

---

## Ready to Ship? 🚀

1. Run: `.\export-database-for-production.ps1`
2. Build: `npm run tauri build`
3. Test: Delete dev DB, run production build
4. Distribute: Share installers from `target/release/bundle/`

**Your content is now ready for the world!** 🎉
