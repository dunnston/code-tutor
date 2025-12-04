# Production Build - Quick Reference

## 🎯 Goal
Bundle ALL your content (questions, enemies, items) with production builds so users get everything instantly!

## ⚡ Quick Steps

### 1️⃣ Add Your Content (Dev Mode)
```bash
npm run tauri dev
```
- Import questions ✅ (Already done!)
- Add custom enemies
- Add custom items
- Create levels

### 2️⃣ Export Database
```powershell
.\export-database-for-production.ps1
```
This copies your dev database to `src-tauri\seed_database.db`

### 3️⃣ Build Production
```bash
npm run tauri build
```

### 4️⃣ Test It!
```powershell
# Delete dev database to simulate fresh install
Remove-Item "$env:APPDATA\code-tutor\code-tutor.db"

# Run production build
cd src-tauri\target\release
.\Code Tutor.exe
```

Verify:
- Question Manager shows all 300 questions
- Enemy Manager shows your enemies
- Dungeon Crawler has all content

### 5️⃣ Distribute
Installers are in: `src-tauri\target\release\bundle\`

---

## 📋 Checklist Before Release

- [ ] All content added in dev mode
- [ ] Export script run successfully
- [ ] Production build completed
- [ ] Tested with fresh database
- [ ] All content verified in app
- [ ] Version number updated in `tauri.conf.json`

---

## 🔧 Commands Reference

| Task | Command |
|------|---------|
| **Dev Mode** | `npm run tauri dev` |
| **Export Database** | `.\export-database-for-production.ps1` |
| **Build Production** | `npm run tauri build` |
| **Delete Dev DB** | `Remove-Item "$env:APPDATA\code-tutor\code-tutor.db"` |
| **Find Dev DB** | `explorer "$env:APPDATA\code-tutor"` |

---

## 🐛 Troubleshooting

**Q: Production build has no questions?**
A: Run `.\export-database-for-production.ps1` before building

**Q: Export script says "Database not found"?**
A: Run dev mode first: `npm run tauri dev`

**Q: How do I update content later?**
A: Re-run export script, rebuild, distribute new version

---

## 📍 Key Files

- `export-database-for-production.ps1` - Export your database
- `src-tauri/seed_database.db` - Bundled content (after export)
- `src-tauri/src/db.rs` - Loading logic
- `PRODUCTION-BUILD-GUIDE.md` - Full documentation

---

**Need help?** See [PRODUCTION-BUILD-GUIDE.md](PRODUCTION-BUILD-GUIDE.md) for detailed instructions.
