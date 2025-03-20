@echo off
setlocal

REM Check if a JSON file was provided
if "%~1"=="" (
  echo Usage: powershell-post-json.bat config.json [output.pdf]
  echo   config.json: JSON configuration file
  echo   output.pdf: Optional output filename (defaults to output.pdf)
  exit /b 1
)

REM Set input file
set "JSON_FILE=%~1"

REM Check if JSON file exists
if not exist "%JSON_FILE%" (
  echo Error: File not found - %JSON_FILE%
  exit /b 1
)

REM Set output file
if "%~2"=="" (
  set "OUTPUT_FILE=output.pdf"
) else (
  set "OUTPUT_FILE=%~2"
)

echo Sending %JSON_FILE% to generate PDF using PowerShell...

REM Use PowerShell to handle the file upload
powershell -Command "& {$form = @{jsonFile=Get-Item -Path '%JSON_FILE%'};Invoke-WebRequest -Uri 'http://127.0.0.1:4002/upload-json' -Method Post -Form $form -OutFile '%OUTPUT_FILE%'}"

if %ERRORLEVEL% EQU 0 (
  echo PDF generated successfully and saved to %OUTPUT_FILE%
) else (
  echo Error generating PDF. Please check if the server is running.
)

endlocal 