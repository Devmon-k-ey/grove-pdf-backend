# Using curl to Generate PDFs from JSON Files

This document provides examples of how to use `curl` to upload JSON configuration files to generate PDFs.

## Prerequisites

- The PDF generator server must be running (typically on port 4002)
- `curl` must be installed on your system
- A valid JSON configuration file (see sample below)

## Sample JSON Configuration

```json
{
  "domain": "grove.xiber.net",
  "includedSpeed": "400/400",
  "includedUnits": "MBPS",
  "additionalSpeeds": [
    {
      "speed": "1000/1000",
      "units": "MBPS",
      "price": "129.99"
    },
    {
      "speed": "2000/2000",
      "units": "MBPS",
      "price": "149.99"
    }
  ]
}
```

## Using the Helper Scripts

We provide helper scripts to make this process easier:

### Windows

```
post-json.bat config.json [output.pdf]
```

### Linux/macOS

```
./post-json.sh config.json [output.pdf]
```

Where:
- `config.json` is your JSON configuration file
- `output.pdf` is the optional output filename (defaults to `grove-output.pdf`)

## Manual curl Commands

If you prefer to use curl directly:

### Windows

```
curl -X POST "http://127.0.0.1:4002/upload-json" -F "jsonFile=@config.json" --output output.pdf
```

### Linux/macOS

```
curl -X POST "http://127.0.0.1:4002/upload-json" -F "jsonFile=@config.json" --output output.pdf
```

## Server Endpoints

- `POST /upload-json` - Upload a JSON file and receive a PDF
- `POST /generate-pdf` - Send JSON data directly in the request body
- `GET /generate-pdf` - Generate a PDF using query parameters

## Troubleshooting

If you encounter issues:

1. Ensure the server is running: `npm start`
2. Verify your JSON file is valid using a JSON validator
3. Check that the server URL is correct (usually http://127.0.0.1:4002)
4. Make sure the output directory is writable 