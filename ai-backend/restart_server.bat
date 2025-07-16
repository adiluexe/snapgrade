@echo off
echo Restarting SnapGrade Backend Server...

REM Kill any existing Python processes running main.py
taskkill /f /im python.exe 2>nul
timeout /t 2 /nobreak >nul

REM Start the server
echo Starting server...
C:\Users\exequel\Code\snapgrade\.venv\Scripts\python.exe main.py
