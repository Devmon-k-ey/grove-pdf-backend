@echo off
setlocal

REM Get the directory where the batch file is located
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo Grove PDF Generator
echo ==================
echo.

set /p DOMAIN=Domain [grove.xiber.net]: 
if "%DOMAIN%"=="" set DOMAIN=grove.xiber.net

set /p INC_SPEED=Included Speed [400/400]: 
if "%INC_SPEED%"=="" set INC_SPEED=400/400

set /p INC_UNITS=Included Units [MBPS]: 
if "%INC_UNITS%"=="" set INC_UNITS=MBPS

echo.
echo Additional Speed 1:
set /p ADD_SPEED1=Speed [1/1]: 
if "%ADD_SPEED1%"=="" set ADD_SPEED1=1/1

set /p ADD_UNITS1=Units [GBPS]: 
if "%ADD_UNITS1%"=="" set ADD_UNITS1=GBPS

set /p ADD_PRICE1=Price [$25]: 
if "%ADD_PRICE1%"=="" set ADD_PRICE1=25

echo.
echo Additional Speed 2 (leave blank to skip):
set /p ADD_SPEED2=Speed: 

if NOT "%ADD_SPEED2%"=="" (
  set /p ADD_UNITS2=Units [GBPS]: 
  if "%ADD_UNITS2%"=="" set ADD_UNITS2=GBPS

  set /p ADD_PRICE2=Price [$35]: 
  if "%ADD_PRICE2%"=="" set ADD_PRICE2=35
)

echo.
echo Additional Speed 3 (leave blank to skip):
set /p ADD_SPEED3=Speed: 

if NOT "%ADD_SPEED3%"=="" (
  set /p ADD_UNITS3=Units [GBPS]: 
  if "%ADD_UNITS3%"=="" set ADD_UNITS3=GBPS

  set /p ADD_PRICE3=Price [$45]: 
  if "%ADD_PRICE3%"=="" set ADD_PRICE3=45
)

echo.
set /p OUTPUT=Output filename [grove-output.pdf]: 
if "%OUTPUT%"=="" set OUTPUT=grove-output.pdf

REM Handle relative and absolute paths for the output file
if not "%OUTPUT:~1,1%"==":" (
  set "OUTPUT=%CD%\%OUTPUT%"
)

REM Set server URL to default value without prompting
set SERVER_URL=http://127.0.0.1:4002

echo.
echo Generating PDF...

set CMD=node "%SCRIPT_DIR%src\cli.js" post -d "%DOMAIN%" -s "%INC_SPEED%" -u "%INC_UNITS%" -o "%OUTPUT%" --url "%SERVER_URL%"

if NOT "%ADD_SPEED1%"=="" (
  set CMD=%CMD% --speed1 "%ADD_SPEED1%" --units1 "%ADD_UNITS1%" --price1 "%ADD_PRICE1%"
)

if NOT "%ADD_SPEED2%"=="" (
  set CMD=%CMD% --speed2 "%ADD_SPEED2%" --units2 "%ADD_UNITS2%" --price2 "%ADD_PRICE2%"
)

if NOT "%ADD_SPEED3%"=="" (
  set CMD=%CMD% --speed3 "%ADD_SPEED3%" --units3 "%ADD_UNITS3%" --price3 "%ADD_PRICE3%"
)

echo Command: %CMD%
%CMD%

echo.
if %ERRORLEVEL% EQU 0 (
  echo PDF generated successfully and saved to %OUTPUT%
) else (
  echo Error generating PDF. Please check if the server is running.
)

pause
endlocal 