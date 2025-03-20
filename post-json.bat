@echo off
setlocal enabledelayedexpansion

REM Check if a JSON file was provided
if "%~1"=="" (
  echo Usage: %~nx0 config.json [output.pdf]
  echo   config.json: JSON configuration file
  echo   output.pdf : Optional output filename (default: grove-output.pdf)
  exit /b 1
)

REM Set and validate input file
set "JSON_FILE=%~1"
if not exist "%JSON_FILE%" (
  echo Error: JSON file not found - "%JSON_FILE%"
  exit /b 1
)

REM Set output file (quoted to handle spaces)
if "%~2"=="" (
  set "OUTPUT_FILE=grove-output.pdf"
) else (
  set "OUTPUT_FILE=%~2"
)

REM Configure server endpoint
set "SERVER_URL=http://127.0.0.1:4002"

echo Grove PDF Generator (JSON File Version)
echo ========================================
echo(
echo [Input]  JSON: "%JSON_FILE%"
echo [Output] PDF:  "%OUTPUT_FILE%"
echo [Server] URL:  %SERVER_URL%
echo(

echo Generating PDF document...
curl -X POST "%SERVER_URL%/upload-json" ^
  -H "Content-Type: multipart/form-data" ^
  -F "jsonFile=@""%JSON_FILE%""" ^
  --progress-bar ^
  --output "%OUTPUT_FILE%"

if %ERRORLEVEL% equ 0 (
  echo(
  echo Success: PDF generated and saved to "%OUTPUT_FILE%"
) else (
  echo(
  echo Error: PDF generation failed
  echo Check that:
  echo 1. The server is running at %SERVER_URL%
  echo 2. The JSON file is properly formatted
  echo 3. You have write permissions for the output location
)

endlocal