@echo off
setlocal EnableDelayedExpansion

echo Grove PDF Generator (curl version)
echo ===============================
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

REM Set server URL to default value without prompting
set SERVER_URL=https://grove-pdf-backend.onrender.com

echo.
echo Generating PDF...

REM Creating JSON file for curl
set "JSON={ \"domain\": \"%DOMAIN%\", \"includedSpeed\": \"%INC_SPEED%\", \"includedUnits\": \"%INC_UNITS%\", \"additionalSpeeds\": ["

set "FIRST_ITEM=true"

REM Add first speed if present
if NOT "%ADD_SPEED1%"=="" (
  set "JSON=!JSON!{ \"speed\": \"%ADD_SPEED1%\", \"units\": \"%ADD_UNITS1%\", \"price\": \"%ADD_PRICE1%\" }"
  set "FIRST_ITEM=false"
)

REM Add second speed if present
if NOT "%ADD_SPEED2%"=="" (
  if "!FIRST_ITEM!"=="false" set "JSON=!JSON!,"
  set "JSON=!JSON!{ \"speed\": \"%ADD_SPEED2%\", \"units\": \"%ADD_UNITS2%\", \"price\": \"%ADD_PRICE2%\" }"
  set "FIRST_ITEM=false"
)

REM Add third speed if present
if NOT "%ADD_SPEED3%"=="" (
  if "!FIRST_ITEM!"=="false" set "JSON=!JSON!,"
  set "JSON=!JSON!{ \"speed\": \"%ADD_SPEED3%\", \"units\": \"%ADD_UNITS3%\", \"price\": \"%ADD_PRICE3%\" }"
)

set "JSON=!JSON!] }"

echo Sending request with data:
echo !JSON!
echo.

REM Use curl to send request
curl -X POST "%SERVER_URL%/generate-pdf" ^
  -H "Content-Type: application/json" ^
  -d "!JSON!" ^
  --output "%OUTPUT%"

echo.
if %ERRORLEVEL% EQU 0 (
  echo PDF generated successfully and saved to %OUTPUT%
) else (
  echo Error generating PDF. Please check if the server is running.
)

pause
endlocal 