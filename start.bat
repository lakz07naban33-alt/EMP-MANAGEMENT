@echo off
echo ================================
echo Employee Management Backend Setup
echo ================================
echo.

echo Installing dependencies...
call npm install

echo.
echo Seeding demo data...
call npm run seed

echo.
echo Starting development server...
call npm run dev