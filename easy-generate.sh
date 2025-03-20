#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

echo "Grove PDF Generator"
echo "=================="
echo

read -p "Domain [grove.xiber.net]: " DOMAIN
DOMAIN=${DOMAIN:-grove.xiber.net}

read -p "Included Speed [400/400]: " INC_SPEED
INC_SPEED=${INC_SPEED:-400/400}

read -p "Included Units [MBPS]: " INC_UNITS
INC_UNITS=${INC_UNITS:-MBPS}

echo
echo "Additional Speed 1:"
read -p "Speed [1/1]: " ADD_SPEED1
ADD_SPEED1=${ADD_SPEED1:-1/1}

read -p "Units [GBPS]: " ADD_UNITS1
ADD_UNITS1=${ADD_UNITS1:-GBPS}

read -p "Price [$25]: " ADD_PRICE1
ADD_PRICE1=${ADD_PRICE1:-25}

echo
echo "Additional Speed 2 (leave blank to skip):"
read -p "Speed: " ADD_SPEED2

if [ ! -z "$ADD_SPEED2" ]; then
  read -p "Units [GBPS]: " ADD_UNITS2
  ADD_UNITS2=${ADD_UNITS2:-GBPS}

  read -p "Price [$35]: " ADD_PRICE2
  ADD_PRICE2=${ADD_PRICE2:-35}
fi

echo
echo "Additional Speed 3 (leave blank to skip):"
read -p "Speed: " ADD_SPEED3

if [ ! -z "$ADD_SPEED3" ]; then
  read -p "Units [GBPS]: " ADD_UNITS3
  ADD_UNITS3=${ADD_UNITS3:-GBPS}

  read -p "Price [$45]: " ADD_PRICE3
  ADD_PRICE3=${ADD_PRICE3:-45}
fi

echo
read -p "Output filename [grove-output.pdf]: " OUTPUT
OUTPUT=${OUTPUT:-grove-output.pdf}

# Handle relative and absolute paths for the output file
if [[ ! "$OUTPUT" = /* ]]; then
  OUTPUT="$(pwd)/$OUTPUT"
fi

# Set server URL to default value without prompting
SERVER_URL="http://127.0.0.1:4002"

echo
echo "Generating PDF..."

CMD="node \"$SCRIPT_DIR/src/cli.js\" post -d \"$DOMAIN\" -s \"$INC_SPEED\" -u \"$INC_UNITS\" -o \"$OUTPUT\" --url \"$SERVER_URL\""

if [ ! -z "$ADD_SPEED1" ]; then
  CMD="$CMD --speed1 \"$ADD_SPEED1\" --units1 \"$ADD_UNITS1\" --price1 \"$ADD_PRICE1\""
fi

if [ ! -z "$ADD_SPEED2" ]; then
  CMD="$CMD --speed2 \"$ADD_SPEED2\" --units2 \"$ADD_UNITS2\" --price2 \"$ADD_PRICE2\""
fi

if [ ! -z "$ADD_SPEED3" ]; then
  CMD="$CMD --speed3 \"$ADD_SPEED3\" --units3 \"$ADD_UNITS3\" --price3 \"$ADD_PRICE3\""
fi

echo "Command: $CMD"
eval $CMD

echo
if [ $? -eq 0 ]; then
  echo "PDF generated successfully and saved to $OUTPUT"
else
  echo "Error generating PDF. Please check if the server is running."
fi

read -p "Press Enter to continue..." 