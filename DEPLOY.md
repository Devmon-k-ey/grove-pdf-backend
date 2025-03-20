# Deployment Guide for Grove PDF Editor

This guide will help you deploy the Grove PDF Editor service to Render.com. After deployment, you'll be able to use the service via HTTP requests from anywhere.

## Prerequisites

- A GitHub account
- A Render.com account

## Step 1: Prepare Your Repository

1. Create a new GitHub repository and push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/pdf-editor.git
git push -u origin main
```

## Step 2: Set Up a Web Service on Render.com

1. Log in to your Render account
2. Click on "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `grove-pdf-editor` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. Add environment variables (if needed):
   - Click on "Advanced" to expand additional settings
   - Add a new environment variable:
     - Key: `PORT`
     - Value: `10000` (or any port)

6. Select your preferred plan (the free plan should be sufficient for most use cases)
7. Click "Create Web Service"

Render will automatically deploy your application and provide you with a URL (e.g., `https://grove-pdf-editor.onrender.com`).

## Step 3: Update Your CLI Tool to Use the Deployed Service

When using your CLI tool, specify the deployed service URL:

```bash
# For Windows (using the batch file)
grove-pdf.bat get --url https://grove-pdf-editor.onrender.com -o output.pdf

# For globally installed CLI
grove-pdf get --url https://grove-pdf-editor.onrender.com -o output.pdf
```

## Step 4: Using curl Commands (if needed)

If you need to use curl directly:

### GET Request

```bash
curl "https://grove-pdf-editor.onrender.com/generate-pdf?domain=example.com&includedSpeed=400/400&includedUnits=MBPS&speed1=1/1&units1=GBPS&price1=25" --output output.pdf
```

### POST Request

```bash
curl -X POST "https://grove-pdf-editor.onrender.com/generate-pdf" \
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

## Troubleshooting

If you encounter issues with the deployed service:

1. Check the Render logs for any errors
2. Make sure all required files (PDF template, fonts) are correctly included in your repository
3. Verify that the PORT environment variable is properly set
4. If using a free plan, note that the service might spin down after inactivity and take a moment to spin up again on the first request

## Additional Configuration for Production

For a production environment, consider:

1. Setting up a custom domain
2. Implementing rate limiting
3. Adding authentication for secure access
4. Setting up monitoring and alerts 