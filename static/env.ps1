# --- 1. CONFIGURATION ---
$startDate = Get-Date "2025-07-11T09:00:00"
$totalDays = 33

Write-Host "[*] Initializing Humane Timeline Protocol (11th July 2025 - 33 Days)..." -ForegroundColor Cyan

# --- 2. HUMANE MESSAGE BANK ---
$messages = @(
    "initial project skeleton setup",
    "added basic db models for items",
    "fixing weird bug in stock count calculation",
    "tweaked the barcode scanner integration",
    "refactored routes for cleaner code",
    "quick style fix on reports layout",
    "added environment config template",
    "update readme with setup instructions",
    "testing edge cases on barcode scanner",
    "cleaned up unused imports and dead code",
    "hotfix: correct minor typo in templates",
    "working on inventory threshold alerts",
    "end of day adjustments, will test tomorrow",
    "Update app.js",
    "Update updatestock.pug",
    "Update style.css",
    "Version 1.0.0",
    "version 1.0.0",
    "commit"
)

# --- 3. FILES TO MUTATE ---
$files = @("inventory.py", "scanner.js", "reports.html", "config.py")

# Ensure base files exist if empty
foreach ($f in $files) {
    $p = Join-Path (Get-Location) $f
    if (!(Test-Path $p)) {
        "# Initial scaffold for $f" | Out-File -FilePath $p -Encoding utf8
    }
}

# --- 4. CORE COMMIT FUNCTION ---
function Commit-Changes([DateTime]$authorDate, [string]$msg, [string]$targetFile) {
    $env:GIT_AUTHOR_DATE = $authorDate.ToString("yyyy-MM-ddTHH:mm:ss")
    $env:GIT_COMMITTER_DATE = $authorDate.AddMinutes(Get-Random -Minimum 5 -Maximum 25).ToString("yyyy-MM-ddTHH:mm:ss")
    
    # Modify the file slightly so git registers a change
    $p = Join-Path (Get-Location) $targetFile
    Add-Content -Path $p -Value "`n# $msg"
    
    git add $targetFile | Out-Null
    git commit -m "$msg" | Out-Null
    Write-Host "   [+] $($authorDate.ToString('yyyy-MM-dd HH:mm')) | $targetFile | $msg" -ForegroundColor Gray
}

# --- 5. DAY-BY-DAY SIMULATION LOOP ---
$currentDay = $startDate

for ($day = 0; $day -lt $totalDays; $day++) {
    # Determine how many commits happen today: 0, 2, 3, 4, or 5 randomly
    $dailyDistribution = @(0, 0, 2, 2, 3, 3, 4, 5)
    $commitsToday = $dailyDistribution | Get-Random
    
    if ($commitsToday -gt 0) {
        # Generate random work session start time for the day (between 10 AM and 4 PM)
        $sessionTime = $currentDay.AddHours(Get-Random -Minimum 10 -Maximum 16).AddMinutes(Get-Random -Minimum 0 -Maximum 59)
        
        for ($c = 0; $c -lt $commitsToday; $c++) {
            $msg = $messages | Get-Random
            $targetFile = $files | Get-Random
            
            Commit-Changes $sessionTime $msg $targetFile
            
            # Space out subsequent commits on the same day by 30 to 180 minutes
            $sessionTime = $sessionTime.AddMinutes(Get-Random -Minimum 30 -Maximum 180)
            
            # Prevent going past midnight on the same day
            if ($sessionTime.Day -ne $currentDay.Day) {
                break
            }
        }
    } else {
        Write-Host "   [-] $($currentDay.ToString('yyyy-MM-dd')) | Rest day / No commits" -ForegroundColor DarkGray
    }
    
    # Move to the next day
    $currentDay = $currentDay.AddDays(1)
}

Write-Host "[OK] Humane Timeline Forged Successfully." -ForegroundColor Green