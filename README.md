# Grove PDF Editor

A tool for automatically generating custom Grove PDF files with configurable speeds, prices, domain information, and TV options.

## Features

- Express.js backend to handle PDF processing
- Supports GET requests with query parameters
- Supports POST requests with JSON data
- Simple CLI tool for easy command-line usage
- Supports up to 3 additional speed/unit/price configurations
- Supports up to 3 TV addon packages
- Automatic fallback to cheetah image when no TV data is provided

## Usage

### Server API

#### GET /generate-pdf

Generate a PDF using query parameters (legacy format):

```
GET /generate-pdf?domain=example.com&includedSpeed=400/400&includedUnits=MBPS&speed1=1/1&units1=GBPS&price1=25&tvTitle1=Premium Channels&tvSubtitle1=Showtime, STARZ, Encore&tvAmount1=15
```

Query Parameters:
- `domain`: Domain name
- `includedSpeed`: Base speed (e.g., "400/400")
- `includedUnits`: Base speed units (e.g., "MBPS")
- For each additional speed (1-3):
  - `speedN`: Speed value
  - `unitsN`: Speed units
  - `priceN`: Price
- For each TV addon (1-3):
  - `tvTitleN`: Package title
  - `tvSubtitleN`: Package description
  - `tvAmountN`: Monthly price

#### POST /generate-pdf

Generate a PDF using a JSON request body. Two data formats are supported:

**Legacy Format:**
```json
{
  "domain": "example.com",
  "includedSpeed": "400/400",
  "includedUnits": "MBPS",
  "additionalSpeeds": [
    {
      "speed": "1/1",
      "units": "GBPS",
      "price": "25"
    },
    {
      "speed": "2/2",
      "units": "GBPS",
      "price": "35"
    }
  ],
  "tv_addons": [
    {
      "title": "Premium Channels",
      "subtitle": "Showtime, STARZ, Encore, etc",
      "amount": "15"
    },
    {
      "title": "Sports Package",
      "subtitle": "ESPN+, NFL Network, MLB.TV",
      "amount": "20"
    }
  ]
}
```

**New Format:**
```json
{
  "domain": "grove.xiber.net",
  "speeds": [
    {"speed": "400", "units": "Mbps", "included": true},
    {"speed": "500", "units": "Mbps", "price": 15},
    {"speed": "1", "units": "Gbps", "price": 25}
  ],
  "tv": [
    {"title": "XiberTV Gold", "subtitle": "130+ Channels", "amount": "39.99"},
    {"title": "XiberTV Platinum", "subtitle": "150+ Channels", "amount": "45.99"}
  ],
  "tv_addons": [
    {"title": "Premium Channels", "subtitle": "Showtime, STARZ, Encore, etc", "amount": "15"}
  ]
}
```

### CLI Tool

#### Using Legacy Format (GET Request)

```bash
# Basic usage with internet and TV options
grove-pdf get -o output.pdf \
  --domain example.com \
  --included-speed 400/400 --included-units MBPS \
  --speed1 1/1 --units1 GBPS --price1 25 \
  --tvTitle1 "Premium Channels" --tvSubtitle1 "Showtime, STARZ, Encore" --tvAmount1 15
```

#### Using New Format

```bash
# Create PDF with new data format
grove-pdf create -o output.pdf \
  --domain grove.xiber.net \
  --incSpeed 400 --incUnits Mbps \
  --addSpeed1 500 --addUnits1 Mbps --addPrice1 15 \
  --addSpeed2 1 --addUnits2 Gbps --addPrice2 25 \
  --tvTitle1 "XiberTV Gold" --tvSubtitle1 "130+ Channels" --tvAmount1 39.99 \
  --tvTitle2 "XiberTV Platinum" --tvSubtitle2 "150+ Channels" --tvAmount2 45.99 \
  --addonTitle "Premium Channels" --addonSubtitle "Showtime, STARZ, Encore, etc" --addonAmount 15
```

#### Using JSON File (Both Formats Supported)

```bash
# Using a JSON configuration file
grove-pdf post -f config.json -o output.pdf
```

Example JSON configuration (`config.json`) in new format:

```json
{
  "domain": "grove.xiber.net",
  "speeds": [
    {"speed": "400", "units": "Mbps", "included": true},
    {"speed": "500", "units": "Mbps", "price": 15},
    {"speed": "1", "units": "Gbps", "price": 25}
  ],
  "tv": [
    {"title": "XiberTV Gold", "subtitle": "130+ Channels", "amount": "39.99"},
    {"title": "XiberTV Platinum", "subtitle": "150+ Channels", "amount": "45.99"}
  ],
  "tv_addons": [
    {"title": "Premium Channels", "subtitle": "Showtime, STARZ, Encore, etc", "amount": "15"}
  ]
}
```

Note: If no TV addons are specified in any request type, the PDF will automatically display the cheetah image in the TV section.

## Deployment

This application can be deployed to services like Render.com.

### Deploying to Render.com

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variable: `PORT=10000` (or any port)