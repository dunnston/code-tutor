# Export Database for Production Build
# This script copies your development database (with all questions, enemies, items, etc.)
# to be bundled with production builds

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Code Tutor - Database Export Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Possible database locations
$locations = @(
    "$env:APPDATA\code-tutor\code-tutor.db",
    "$env:LOCALAPPDATA\code-tutor\code-tutor.db",
    "$env:USERPROFILE\AppData\Local\code-tutor\code-tutor.db",
    "$env:USERPROFILE\AppData\Roaming\code-tutor\code-tutor.db"
)

$dbPath = $null

Write-Host "Searching for development database..." -ForegroundColor Yellow
foreach ($loc in $locations) {
    if (Test-Path $loc) {
        $dbPath = $loc
        Write-Host "✓ Found database at: $loc" -ForegroundColor Green
        break
    }
}

if ($null -eq $dbPath) {
    Write-Host "✗ Database not found at standard locations!" -ForegroundColor Red
    Write-Host ""
    Write-Host "The database is created when you first run the app." -ForegroundColor Yellow
    Write-Host "Please run the app at least once, then run this script again." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Searched locations:" -ForegroundColor Gray
    foreach ($loc in $locations) {
        Write-Host "  - $loc" -ForegroundColor Gray
    }
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Show database info
$dbInfo = Get-Item $dbPath
Write-Host ""
Write-Host "Database Information:" -ForegroundColor Cyan
Write-Host "  Size: $([math]::Round($dbInfo.Length / 1KB, 2)) KB" -ForegroundColor White
Write-Host "  Last Modified: $($dbInfo.LastWriteTime)" -ForegroundColor White
Write-Host ""

# Check what's in the database
try {
    Add-Type -Path "System.Data.SQLite.dll" -ErrorAction SilentlyContinue
} catch {}

# Count records (if sqlite3 is available)
$sqlite3Path = Get-Command sqlite3 -ErrorAction SilentlyContinue
if ($sqlite3Path) {
    Write-Host "Database Contents:" -ForegroundColor Cyan

    $questionCount = & sqlite3 $dbPath "SELECT COUNT(*) FROM mcq_questions;" 2>$null
    if ($questionCount) {
        Write-Host "  MCQ Questions: $questionCount" -ForegroundColor White
    }

    $enemyCount = & sqlite3 $dbPath "SELECT COUNT(*) FROM custom_enemies;" 2>$null
    if ($enemyCount) {
        Write-Host "  Custom Enemies: $enemyCount" -ForegroundColor White
    }

    $itemCount = & sqlite3 $dbPath "SELECT COUNT(*) FROM equipment_items;" 2>$null
    if ($itemCount) {
        Write-Host "  Equipment Items: $itemCount" -ForegroundColor White
    }

    Write-Host ""
}

# Destination path
$destPath = Join-Path $PSScriptRoot "src-tauri\seed_database.db"

Write-Host "Ready to copy database to: $destPath" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Copy database for production build? (Y/N)"

if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Red
    exit 0
}

# Create backup of existing seed if it exists
if (Test-Path $destPath) {
    $backupPath = "$destPath.backup"
    Write-Host "Creating backup of existing seed database..." -ForegroundColor Yellow
    Copy-Item $destPath $backupPath -Force
    Write-Host "✓ Backup created at: $backupPath" -ForegroundColor Green
}

# Copy the database
try {
    Copy-Item $dbPath $destPath -Force
    Write-Host "✓ Database copied successfully!" -ForegroundColor Green

    $seedInfo = Get-Item $destPath
    Write-Host ""
    Write-Host "Seed Database Created:" -ForegroundColor Cyan
    Write-Host "  Location: $destPath" -ForegroundColor White
    Write-Host "  Size: $([math]::Round($seedInfo.Length / 1KB, 2)) KB" -ForegroundColor White
    Write-Host ""
    Write-Host "This database will be bundled with production builds." -ForegroundColor Green
    Write-Host "All users will get your questions, enemies, items, etc.!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Build the app: npm run tauri build" -ForegroundColor White
    Write-Host "  2. Test the production build" -ForegroundColor White
    Write-Host "  3. Distribute to users!" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host "✗ Failed to copy database: $_" -ForegroundColor Red
    exit 1
}

Read-Host "Press Enter to exit"
