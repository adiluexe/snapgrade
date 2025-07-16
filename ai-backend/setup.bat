@echo off
REM SnapGrade AI Backend Setup Script for Windows
REM This script sets up the Python environment for the OpenCV backend

echo 🎯 Setting up SnapGrade AI Backend...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Display Python version
for /f "tokens=2" %%a in ('python --version') do echo ✅ Python %%a detected

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo ⬆️  Upgrading pip...
python -m pip install --upgrade pip

REM Install dependencies
echo 📚 Installing dependencies...
pip install -r requirements.txt

REM Verify installation
echo 🔍 Verifying installation...
python -c "import cv2; import numpy; import fastapi; print('✅ All packages installed successfully!')"

echo 🎉 Setup complete!
echo.
echo To start the backend server:
echo 1. Activate the virtual environment:
echo    venv\Scripts\activate
echo 2. Run the server:
echo    python main.py
echo.
echo The API will be available at: http://localhost:8000
echo API docs will be available at: http://localhost:8000/docs

pause
