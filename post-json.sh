#!/bin/bash

# Check if a JSON file was provided
if [ $# -lt 1 ]; then
  echo "Usage: ./post-json.sh config.json [output.pdf]"
  echo "  config.json: JSON configuration file"
  echo "  output.pdf: Optional output filename (defaults to grove-output.pdf)"
  exit 1
fi

# Set input file
JSON_FILE="$1"

# Check if JSON file exists
if [ ! -f "$JSON_FILE" ]; then
  echo "Error: File not found - $JSON_FILE"
  exit 1
fi

# Set output file
if [ $# -lt 2 ]; then
  OUTPUT_FILE="grove-output.pdf"
else
  OUTPUT_FILE="$2"
fi

# Set server URL
SERVER_URL="http://127.0.0.1:4002"

echo "Grove PDF Generator (JSON file version)"
echo "==================================="
echo
echo "Input JSON: $JSON_FILE"
echo "Output PDF: $OUTPUT_FILE"
echo "Server URL: $SERVER_URL"
echo
echo "Generating PDF..."

# Use curl to send the file as form-data
curl -X POST "$SERVER_URL/upload-json" \
  -F "jsonFile=@$JSON_FILE" \
  --output "$OUTPUT_FILE"

echo
if [ $? -eq 0 ]; then
  echo "PDF generated successfully and saved to $OUTPUT_FILE"
else
  echo "Error generating PDF. Please check if the server is running."
fi 