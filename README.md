# Grove PDF Editor

A tool for automatically generating custom Grove PDF files with configurable speeds, prices, and domain information.

## Features

- Express.js backend to handle PDF processing
- Supports GET requests with query parameters
- Supports POST requests with JSON data
- Simple CLI tool for easy command-line usage
- Supports up to 3 additional speed/unit/price configurations

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

The server will start at http://localhost:4002 by default.

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
GET /generate-pdf?domain=example.com&includedSpeed=400/400&includedUnits=MBPS&speed1=1/1&units1=GBPS&price1=25
```

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
  ]
}
```

### CLI Tool

#### Using GET Request

```bash
# Basic usage
grove-pdf get -o output.pdf

# With custom domain and included speed
grove-pdf get -d example.com -s 500/500 -u MBPS -o output.pdf

# With one additional speed
grove-pdf get --speed1 1/1 --units1 GBPS --price1 25 -o output.pdf

# With multiple additional speeds
grove-pdf get --speed1 1/1 --units1 GBPS --price1 25 \
              --speed2 2/2 --units2 GBPS --price2 35 \
              --speed3 3/3 --units3 GBPS --price3 45 \
              -o output.pdf
```

#### Using POST Request

```bash
# Basic usage with command line parameters
grove-pdf post -o output.pdf

# With custom values
grove-pdf post -d example.com -s 500/500 -u MBPS \
               --speed1 1/1 --units1 GBPS --price1 25 \
               -o output.pdf

# Using a JSON configuration file
grove-pdf post -f config.json -o output.pdf
```

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
  ]
}
```

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