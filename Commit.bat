@echo off

Setlocal EnableDelayedExpansion

rem SCRIPT LIBRARY -----------------------
set "From=C:\Users\cimbu\AppData\Local\"N3V Games"\TANE\"build 0c4nw28g1"\editing\"kuid 276690 400045 G- AZD knihovna scrip""
set "To=C:\TrainzNavka\"kuid 276690 400045 G- AZD knihovna scrip""

echo ----------------------------------------------------
echo "Copying latest script library to commit changes..."
echo.
echo From: %From%
echo To:   %To%
echo ----------------------------------------------------

XCOPY /Y /S %From% %To%

if ERRORLEVEL 1 goto ProcessError

set /a loopcount=5
set /a i=0

:loop
set /a Index=i+1
set "FromAzdScenery=C:\Users\cimbu\AppData\Local\"N3V Games"\TANE\"build 0c4nw28g1"\editing\"kuid 276690 50020%i% G- AZD70 %Index%""
set "ToAzdScenery=C:\TrainzNavka\"kuid 276690 50020%i% G- AZD70 %Index%""

echo ----------------------------------------------------
echo "Copying latest AZD%Index% to commit changes..."
echo From: %FromAzdScenery%
echo To:   %ToAzdScenery%
echo ----------------------------------------------------

XCOPY /Y /e %FromAzdScenery% %ToAzdScenery%

if ERRORLEVEL 1 goto ProcessError

set /a i=i+1

if %i%==%loopcount% goto exitloop
goto loop

:exitloop
echo .
echo ----------------------------------------------------
echo "Copied successfully"
echo ----------------------------------------------------



echo ----------------------------------------------------
echo "Commiting..."
echo ----------------------------------------------------
set /p Input=Enter commit message: 

echo Commiting to TrainzNavka with commit: "%Input%"

git checkout dev
git add -A
git commit -m "%Input%"

echo .
echo ----------------------------------------------------
echo "Locally commited to dev with message %Input%"
echo ----------------------------------------------------

goto ExitSuccess

rem TODO[vojtech.cimbura] Find a way to commit using batch script - neccessary to have SSH key on
git push --set-upstream origin dev


goto ExitSuccess

:ExitSuccess
pause
exit /b 0


:ProcessError
echo "Copy Failed! Aborting..."
pause
exit /b 1