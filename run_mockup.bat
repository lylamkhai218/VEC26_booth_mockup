@echo off
title VEC 2026 - 3D Booth Mockup Viewer
echo ===================================================
echo   T&T VINA x MURRPLASTIK - 3D BOOTH MOCKUP VIEWER
echo ===================================================
echo Dang khoi dong may chu xem 3D tren trinh duyet...
start http://localhost:8080/mockup/
python -m http.server 8080 --directory "%~dp0.."
pause
