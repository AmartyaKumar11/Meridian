# Start FastAPI Server

Write-Host "Starting News Analytics API Server..." -ForegroundColor Green

# Navigate to backend directory
Set-Location -Path "D:\DSFM\dashboard\backend"

# Start uvicorn server
& "D:/DSFM/dashboard/.venv/Scripts/python.exe" -m uvicorn api.main:app --host 127.0.0.1 --port 8000

Write-Host "`nAPI Server stopped." -ForegroundColor Yellow
