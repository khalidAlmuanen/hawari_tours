# ═══════════════════════════════════════════════════════════════
# 🚀 START CLEAN SCRIPT - Hawari Tours
# يوقف جميع عمليات Node.js ويشغل المشروع من جديد
# ═══════════════════════════════════════════════════════════════

Write-Host "🔄 Stopping all Node.js processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "⏳ Waiting 2 seconds..." -ForegroundColor Cyan
Start-Sleep -Seconds 2

Write-Host "🧹 Cleaning .next folder..." -ForegroundColor Magenta
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "✅ Starting development server..." -ForegroundColor Green
npm run dev
