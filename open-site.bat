@echo off
cd /d "%~dp0"
node scripts\open_site.js
if errorlevel 1 pause
