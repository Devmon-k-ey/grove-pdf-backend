#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const program = new Command();

program
  .name('grove-pdf')
  .description('CLI tool for generating custom Grove PDF files')
  .version('1.0.0');

// Common options for all commands
const addCommonOptions = (command) => {
  return command
    .option('-d, --domain <domain>', 'Domain for the QR code', 'grove.xiber.net')
    .option('-s, --included-speed <speed>', 'Included speed', '400/400')
    .option('-u, --included-units <units>', 'Included speed units', 'MBPS')
    .option('-o, --output <file>', 'Output file name', 'grove-output.pdf')
    .option('--url <url>', 'Custom service URL', 'http://127.0.0.1:4002');
};

// Helper function to make HTTP requests
function makeRequest(url, method, postData = null) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const httpClient = isHttps ? https : http;
    
    const options = new URL(url);
    options.method = method;
    
    if (method === 'POST' && postData) {
      options.headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      };
    }

    const req = httpClient.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks);
        
        if (res.statusCode >= 400) {
          reject(new Error(`Request failed with status code ${res.statusCode}`));
        } else if (res.headers['content-type']?.includes('application/json')) {
          resolve(JSON.parse(body.toString()));
        } else {
          resolve(body);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (method === 'POST' && postData) {
      req.write(postData);
    }
    req.end();
  });
}

// GET command
program
  .command('get')
  .description('Generate PDF using a GET request')
  .option('--speed1 <speed>', 'Additional speed 1')
  .option('--units1 <units>', 'Additional speed 1 units')
  .option('--price1 <price>', 'Additional speed 1 price')
  .option('--speed2 <speed>', 'Additional speed 2')
  .option('--units2 <units>', 'Additional speed 2 units')
  .option('--price2 <price>', 'Additional speed 2 price')
  .option('--speed3 <speed>', 'Additional speed 3')
  .option('--units3 <units>', 'Additional speed 3 units')
  .option('--price3 <price>', 'Additional speed 3 price');

addCommonOptions(program.commands[0]);

program.commands[0].action(async (options) => {
  try {
    console.log('Generating PDF via GET request...');
    
    // Construct query parameters
    const params = new URLSearchParams();
    params.append('domain', options.domain);
    params.append('includedSpeed', options.includedSpeed);
    params.append('includedUnits', options.includedUnits);
    
    // Add additional speeds if provided
    for (let i = 1; i <= 3; i++) {
      if (options[`speed${i}`]) {
        params.append(`speed${i}`, options[`speed${i}`]);
        params.append(`units${i}`, options[`units${i}`] || 'GBPS');
        params.append(`price${i}`, options[`price${i}`] || '25');
      }
    }
    
    const url = `${options.url}/generate-pdf?${params.toString()}`;
    const pdfBuffer = await makeRequest(url, 'GET');
    
    fs.writeFileSync(options.output, pdfBuffer);
    console.log(`PDF saved to ${options.output}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
});

// POST command
program
  .command('post')
  .description('Generate PDF using a POST request')
  .option('-f, --file <file>', 'JSON file with configuration')
  .option('--speed1 <speed>', 'Additional speed 1')
  .option('--units1 <units>', 'Additional speed 1 units', 'GBPS')
  .option('--price1 <price>', 'Additional speed 1 price', '25')
  .option('--speed2 <speed>', 'Additional speed 2')
  .option('--units2 <units>', 'Additional speed 2 units', 'GBPS')
  .option('--price2 <price>', 'Additional speed 2 price', '35')
  .option('--speed3 <speed>', 'Additional speed 3')
  .option('--units3 <units>', 'Additional speed 3 units', 'GBPS')
  .option('--price3 <price>', 'Additional speed 3 price', '45');

addCommonOptions(program.commands[1]);

program.commands[1].action(async (options) => {
  try {
    console.log('Generating PDF via POST request...');
    
    let postData;
    
    if (options.file) {
      // Read from JSON file
      const filePath = path.resolve(options.file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      postData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } else {
      // Construct from command line options
      postData = {
        domain: options.domain,
        includedSpeed: options.includedSpeed,
        includedUnits: options.includedUnits,
        additionalSpeeds: []
      };
      
      // Add additional speeds if provided
      for (let i = 1; i <= 3; i++) {
        if (options[`speed${i}`]) {
          postData.additionalSpeeds.push({
            speed: options[`speed${i}`],
            units: options[`units${i}`],
            price: options[`price${i}`]
          });
        }
      }
    }
    
    const url = `${options.url}/generate-pdf`;
    const pdfBuffer = await makeRequest(url, 'POST', JSON.stringify(postData));
    
    fs.writeFileSync(options.output, pdfBuffer);
    console.log(`PDF saved to ${options.output}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
});

program.parse(process.argv); 