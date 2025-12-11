# Export Clean Database for Production Build
# This script exports ONLY content data (questions, enemies, items, etc.)
# User-specific data (inventory, progress, stats) is NOT included

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Code Tutor - Clean Database Export" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Possible database locations (Tauri 2.x uses app identifier as folder name)
$locations = @(
    "$env:APPDATA\com.codetutor.app\code-tutor.db",
    "$env:LOCALAPPDATA\com.codetutor.app\code-tutor.db",
    "$env:APPDATA\code-tutor\code-tutor.db",
    "$env:LOCALAPPDATA\code-tutor\code-tutor.db"
)

$dbPath = $null

Write-Host "Searching for development database..." -ForegroundColor Yellow
foreach ($loc in $locations) {
    if (Test-Path $loc) {
        $dbPath = $loc
        Write-Host "[OK] Found database at: $loc" -ForegroundColor Green
        break
    }
}

if ($null -eq $dbPath) {
    Write-Host "[X] Database not found!" -ForegroundColor Red
    Write-Host "Run the app at least once, then run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Destination path
$destPath = Join-Path $PSScriptRoot "src-tauri\seed_database.db"

# Create a copy first
Write-Host ""
Write-Host "Creating clean seed database..." -ForegroundColor Yellow

# Remove existing seed if present
if (Test-Path $destPath) {
    Remove-Item $destPath -Force
}

# Copy the database
Copy-Item $dbPath $destPath -Force
Write-Host "[OK] Database copied" -ForegroundColor Green

# Tables that contain user-specific data (to be cleared)
$userTables = @(
    "users",
    "user_currency",
    "currency_transactions",
    "user_inventory",
    "purchase_history",
    "user_active_effects",
    "user_quest_progress",
    "user_dungeon_progress",
    "dungeon_combat_log",
    "dungeon_session",
    "user_challenge_history",
    "user_challenge_history_new",
    "playground_projects",
    "user_snippet_library",
    "playground_likes",
    "playground_comments",
    "playground_sessions",
    "user_playground_achievements",
    "character_stats",
    "character_equipment",
    "user_abilities",
    "user_boss_defeats",
    "user_narrative_progress",
    "skill_check_history",
    "user_active_abilities",
    "user_ability_cooldowns",
    "user_dungeon_achievements",
    "user_equipment_inventory",
    "equipment_inventory",
    "stat_point_history",
    "user_consumable_inventory",
    "shop_purchases",
    "shop_refresh_state",
    "shop_active_inventory",
    "user_achievement_progress",
    "user_achievement_stats",
    "achievement_rewards_claimed",
    "achievement_notifications",
    "user_puzzle_progress"
)

# Check for sqlite3
$sqlite3Available = $false
try {
    $sqlite3Path = Get-Command sqlite3 -ErrorAction SilentlyContinue
    if ($sqlite3Path) {
        $sqlite3Available = $true
    }
} catch {}

if ($sqlite3Available) {
    Write-Host ""
    Write-Host "Cleaning user-specific data..." -ForegroundColor Yellow

    foreach ($table in $userTables) {
        $result = & sqlite3 $destPath "DELETE FROM $table;" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [OK] Cleared $table" -ForegroundColor Green
        }
    }

    # Vacuum to reclaim space
    & sqlite3 $destPath "VACUUM;"
    Write-Host ""
    Write-Host "[OK] Database cleaned and compacted" -ForegroundColor Green

    # Show content stats
    Write-Host ""
    Write-Host "Content included in seed database:" -ForegroundColor Cyan

    $questionCount = & sqlite3 $destPath "SELECT COUNT(*) FROM mcq_questions;" 2>$null
    if ($questionCount) { Write-Host "  MCQ Questions: $questionCount" -ForegroundColor White }

    $enemyCount = & sqlite3 $destPath "SELECT COUNT(*) FROM custom_enemies;" 2>$null
    if ($enemyCount) { Write-Host "  Custom Enemies: $enemyCount" -ForegroundColor White }

    $itemCount = & sqlite3 $destPath "SELECT COUNT(*) FROM equipment_items;" 2>$null
    if ($itemCount) { Write-Host "  Equipment Items: $itemCount" -ForegroundColor White }

    $locationCount = & sqlite3 $destPath "SELECT COUNT(*) FROM narrative_locations;" 2>$null
    if ($locationCount) { Write-Host "  Narrative Locations: $locationCount" -ForegroundColor White }

    $achievementCount = & sqlite3 $destPath "SELECT COUNT(*) FROM achievements;" 2>$null
    if ($achievementCount) { Write-Host "  Achievements: $achievementCount" -ForegroundColor White }

} else {
    Write-Host ""
    Write-Host "[!] sqlite3 not found - database copied but user data NOT cleaned!" -ForegroundColor Red
    Write-Host ""
    Write-Host "To install sqlite3:" -ForegroundColor Yellow
    Write-Host "  Option 1: winget install SQLite.SQLite" -ForegroundColor White
    Write-Host "  Option 2: choco install sqlite" -ForegroundColor White
    Write-Host "  Option 3: Download from https://sqlite.org/download.html" -ForegroundColor White
    Write-Host ""
    Write-Host "After installing, run this script again to clean user data." -ForegroundColor Yellow
}

$seedInfo = Get-Item $destPath
Write-Host ""
Write-Host "Seed Database Ready:" -ForegroundColor Cyan
Write-Host "  Location: $destPath" -ForegroundColor White
Write-Host "  Size: $([math]::Round($seedInfo.Length / 1KB, 2)) KB" -ForegroundColor White
Write-Host ""

if (-not $sqlite3Available) {
    Write-Host "[WARNING] User data may still be in the seed database!" -ForegroundColor Red
    Write-Host "Install sqlite3 and run again before building." -ForegroundColor Yellow
} else {
    Write-Host "[OK] Ready for production build!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. npm run tauri build" -ForegroundColor White
}

Write-Host ""
Read-Host "Press Enter to exit"
