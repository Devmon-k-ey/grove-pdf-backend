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

## Installation

### Server

```bash
# Clone the repository
git clone <repository-url>
cd pdf-editor

# Install dependencies
npm install

# Start the server
npm start
```

The server will start at https://grove-pdf-backend.onrender.com by default.

### CLI Tool

```bash
# Install the CLI tool globally
npm run install-cli
```

This will make the `grove-pdf` command available globally on your system.

## Usage

### Server API

#### GET /generate-pdf

Generate a PDF using query parameters:

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

Generate a PDF using a JSON request body:

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

### CLI Tool

#### Using GET Request

```bash
# Basic usage with internet and TV options
grove-pdf get -o output.pdf \
  --domain example.com \
  --speed1 1/1 --units1 GBPS --price1 25 \
  --tvTitle1 "Premium Channels" --tvSubtitle1 "Showtime, STARZ, Encore" --tvAmount1 15

# Complete example with multiple speeds and TV packages
grove-pdf get \
  --domain example.com \
  --includedSpeed 500/500 --includedUnits MBPS \
  --speed1 1/1 --units1 GBPS --price1 25 \
  --speed2 2/2 --units2 GBPS --price2 35 \
  --tvTitle1 "Premium Channels" --tvSubtitle1 "Showtime, STARZ, Encore" --tvAmount1 15 \
  --tvTitle2 "Sports Package" --tvSubtitle2 "ESPN+, NFL Network" --tvAmount2 20 \
  -o output.pdf
```

#### Using POST Request with JSON File

Example JSON configuration (`config.json`):

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
    },
    {
      "title": "Kids & Family",
      "subtitle": "Disney+, Nickelodeon, PBS Kids",
      "amount": "10"
    }
  ]
}
```

```bash
# Using a JSON configuration file
grove-pdf post -f config.json -o output.pdf
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

## License

ISC 