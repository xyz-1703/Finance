@echo off
echo Starting Django Backend...
cd /d "%~dp0backend"
call venv\Scripts\activate
venv\Scripts\python.exe manage.py runserver
pause
