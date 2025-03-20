# Grove PDF Generator - curl Examples

These examples show how to use curl directly to generate PDFs without requiring Node.js.

## Prerequisites

- The Grove PDF Editor server must be running
- curl installed on your system

## Basic Examples

### Example 1: Simple GET request

This will use the default values and output to output.pdf:

```bash
curl "http://127.0.0.1:4002/generate-pdf?domain=grove.xiber.net&includedSpeed=400/400&includedUnits=MBPS" --output output.pdf
```

### Example 2: GET request with one additional speed

```bash
curl "http://127.0.0.1:4002/generate-pdf?domain=example.com&includedSpeed=500/500&includedUnits=MBPS&speed1=1/1&units1=GBPS&price1=25" --output output.pdf
```

### Example 3: POST request with JSON data

Create a file named `data.json` with your configuration:

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

Then run:

```bash
curl -X POST "http://127.0.0.1:4002/generate-pdf" \
  -H "Content-Type: application/json" \
  -d @data.json \
  --output output.pdf
```

### Example 4: POST request with inline JSON

```bash
curl -X POST "http://127.0.0.1:4002/generate-pdf" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example.com",
    "includedSpeed": "400/400",
    "includedUnits": "MBPS",
    "additionalSpeeds": [
      {
        "speed": "1/1",
        "units": "GBPS",
        "price": "25"
      }
    ]
  }' \
  --output output.pdf
```

## Windows CMD Examples

For Windows Command Prompt, use the following syntax:

```cmd
curl -X POST "http://127.0.0.1:4002/generate-pdf" ^
  -H "Content-Type: application/json" ^
  -d "{\"domain\":\"example.com\",\"includedSpeed\":\"400/400\",\"includedUnits\":\"MBPS\",\"additionalSpeeds\":[{\"speed\":\"1/1\",\"units\":\"GBPS\",\"price\":\"25\"}]}" ^
  --output output.pdf
```

## Windows PowerShell Examples

For PowerShell, use the following syntax:

```powershell
$json = @"
{
  "domain": "example.com",
  "includedSpeed": "400/400",
  "includedUnits": "MBPS",
  "additionalSpeeds": [
    {
      "speed": "1/1",
      "units": "GBPS",
      "price": "25"
    }
  ]
}
"@

curl -X POST "http://127.0.0.1:4002/generate-pdf" `
  -H "Content-Type: application/json" `
  -d $json `
  --output output.pdf
```

## Remote Server Examples

If your server is deployed on Render.com:

```bash
curl -X POST "https://your-service-name.onrender.com/generate-pdf" \
  -H "Content-Type: application/json" \
  -d @data.json \
  --output output.pdf
``` 