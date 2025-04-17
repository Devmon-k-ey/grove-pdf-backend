const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const multer = require('multer');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}));

// Function to generate QR code
async function generateQRCode(text) {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 150,
      height: 150
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

// Main function to modify PDF
async function modifyPDF(data) {
  try {
    const pdfPath = path.join(__dirname, './pdfs/grove.pdf');
    const existingPdfBytes = fs.readFileSync(pdfPath);
    
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);

    // Load fonts
    const brandonBoldFontPath = path.join(__dirname, './fonts/Brandon Grotesque Bold.ttf');
    const graphieBoldFontPath = path.join(__dirname, './fonts/Graphie Bold.ttf');
    const graphieSemiBoldFontPath = path.join(__dirname, './fonts/Graphie_SemiBold.otf');
    
    const brandonBoldFontBytes = fs.readFileSync(brandonBoldFontPath);
    const graphieBoldFontBytes = fs.readFileSync(graphieBoldFontPath);
    const graphieSemiBoldFontBytes = fs.readFileSync(graphieSemiBoldFontPath);
    
    const brandonBold = await pdfDoc.embedFont(brandonBoldFontBytes);
    const graphieBold = await pdfDoc.embedFont(graphieBoldFontBytes);
    const graphieSemiBold = await pdfDoc.embedFont(graphieSemiBoldFontBytes);
    // Load images
    const unitImagePath = path.join(__dirname, './images/unit.png');
    const unitImageBytes = fs.readFileSync(unitImagePath);
    const unitImage = await pdfDoc.embedPng(unitImageBytes);
    const unitImageDims = unitImage.scale(0.14);

    const removerImagePath = path.join(__dirname, './images/remover.png');
    const removerImageBytes = fs.readFileSync(removerImagePath);
    const removerImage = await pdfDoc.embedPng(removerImageBytes);
    const removerImageDims = removerImage.scale(0.14);

    // Load cheetah image for TV section fallback
    const cheetahImagePath = path.join(__dirname, './images/cheetah.png');
    const cheetahImageBytes = fs.readFileSync(cheetahImagePath);
    const cheetahImage = await pdfDoc.embedPng(cheetahImageBytes);

    // Generate QR Code
    const qrDataUrl = await generateQRCode(data.domain);
    const qrImageBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
    const qrImage = await pdfDoc.embedPng(qrImageBytes);

    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const { width, height } = page.getSize();

      // Helper function to get text width
      const getTextWidth = (text, font, size) => {
        return font.widthOfTextAtSize(text, size);
      };

      // Draw unit image first (behind the text)
      page.drawImage(removerImage, {
        x: 240,
        y: 316,
        width: removerImageDims.width * 10,
        height: removerImageDims.height * 2.5
      });

      // Draw unit image first (behind the text)
      page.drawImage(removerImage, {
        x: 400,
        y: 442,
        width: removerImageDims.width,
        height: removerImageDims.height,
      });

      //////////////////////////////////////////////////     
      // for (let i = 0; i < 100; i ++) {
      //   page.drawText((i * 10).toString(), {
      //     x: 300,
      //     y: height - 10 * i,
      //     size: 8,
      //     font: graphieBold,
      //     color: rgb(0, 0, 0)
      //   });

      //   page.drawText((i).toString(), {
      //     x: i * 10,
      //     y: height - 10,
      //     size: 6,
      //     font: graphieBold,
      //     color: rgb(0, 0, 0)
      //   });

      // }
      ///////////////////////////////////////////////////

      // Draw Domain
      page.drawText(data.domain, {
        x: 87,
        y: height - 190,
        size: 44,
        font: brandonBold,
        color: rgb(1, 1, 1)
      });

      // Draw Included Speed
      const includedSpeedX = 250;
      const includedSpeedText = `${data.includedSpeed}`;
      const includedSpeedWidth = getTextWidth(includedSpeedText, graphieBold, 31.7);
      
      page.drawText(includedSpeedText, {
        x: includedSpeedX,
        y: height - 343,
        size: 34,
        font: graphieBold,
        color: rgb(0, 0, 0)
      });

      const includedUnitsX = includedSpeedX + includedSpeedWidth + 10;
      
      // Draw unit image first (behind the text)
      page.drawImage(unitImage, {
        x: includedUnitsX + 5,
        y: height - 350,
        width: unitImageDims.width,
        height: unitImageDims.height,
        opacity: 0.3
      });
      
      
      // Draw units text over the image
      page.drawText(`${data.includedUnits}`, {
        x: includedUnitsX,
        y: height - 337,
        size: 14,
        font: graphieBold,
        color: rgb(0, 0, 0)
      });

      // Draw Additional Speeds (up to 3)
      const additionalSpeeds = data.additionalSpeeds || [];
      const numAdditionalSpeeds = Math.min(additionalSpeeds.length, 3);
      
      if (numAdditionalSpeeds > 0) {
        // Adjust vertical position based on number of additional speeds
        let baseY;
        let spacing;
        
        switch (numAdditionalSpeeds) {
          case 1:
            // With only one additional speed, place it at the original position
            baseY = height - 445;
            spacing = 0;
            break;
          case 2:
            // With two additional speeds, move the first one up slightly
            baseY = height - 425;
            spacing = 45;
            break;
          case 3:
            // With three additional speeds, distribute them evenly
            baseY = height - 415;
            spacing = 35;
            break;
          default:
            baseY = height - 445;
            spacing = 0;
        }

        const additionTextTitle = 'A D D I T I O N A L   U P G R A D E S   A V A I L A B L E';
        page.drawText(additionTextTitle, {
          x: 263,
          y: baseY + (numAdditionalSpeeds === 1 ? 50 : numAdditionalSpeeds === 2 ? 42 : 33),
          size: 10,
          font: graphieSemiBold,
          color: rgb(0.263, 0.306, 0.631)
        });
        

        page.drawText('Synchronous Speeds (Upload & Download)', {
          x: 256,
          y: baseY - ((numAdditionalSpeeds-1) * spacing) - (10 + 15/numAdditionalSpeeds),
          size: 9.1,
          font: graphieBold,
          color: rgb(0.55, 0.55, 0.55)
        });
        
        for (let i = 0; i < numAdditionalSpeeds; i++) {
          const speedItem = additionalSpeeds[i];
          const currentY = baseY - (i * spacing);
          
          // Draw Speed
          const additionalSpeedX = 250;
          const additionalSpeedText = `${speedItem.speed}`;
          const additionalSpeedWidth = getTextWidth(additionalSpeedText, graphieBold, 31.7);

          
          
          page.drawText(additionalSpeedText, {
            x: additionalSpeedX,
            y: currentY,
            size: 34,
            font: graphieBold,
            color: rgb(0, 0, 0)
          });

          // Draw Units
          const additionalUnitsX = additionalSpeedX + additionalSpeedWidth + 10;
          
          // Draw unit image first (behind the text)
          page.drawImage(unitImage, {
            x: additionalUnitsX + 5,
            y: currentY - 10,
            width: unitImageDims.width,
            height: unitImageDims.height,
            opacity: 0.3
          });
          
          // Then draw the text over the image
          page.drawText(`${speedItem.units}`, {
            x: additionalUnitsX,
            y: currentY + 5,
            size: 14,
            font: graphieBold,
            color: rgb(0, 0, 0)
          });

          // Draw Price
          const priceX = 445;
          
          page.drawText(`$`, {
            x: priceX,
            y: currentY + 7,
            size: 23,
            font: graphieBold,
            color: rgb(0.263, 0.306, 0.631)
          });

          const priceText = `${speedItem.price}`;
          page.drawText(priceText, {
            x: priceX + 13,
            y: currentY,
            size: 33,
            font: graphieBold,
            color: rgb(0.263, 0.306, 0.631)
          });

          page.drawText(`/mo`, {
            x: priceX + 15 + getTextWidth(priceText, graphieBold, 33),
            y: currentY + 10,
            size: 16,
            font: graphieBold,
            color: rgb(0.263, 0.306, 0.631)
          });
        }
      }

      // Draw QR Code
      page.drawRectangle({
        x: 50,
        y: height-300,
        width: 70,
        height: 70,
        color: rgb(1, 1, 1)
      })
      page.drawImage(qrImage, {
        x: 55,
        y: height - 295,
        width: 60,
        height: 60,
      });

      // After drawing additional speeds section, add TV section
      if (data.tv_addons && data.tv_addons.length > 0) {

        // Set White image to remove background
        page.drawImage(removerImage, {
          x: 0,
          y: 110,
          width: 280,
          height: 180,
        });
        
        const tvAddons = data.tv_addons.slice(0, 3); // Limit to 3 items
        const tvBaseY = height - 575; // Adjust this Y position as needed
        const tvBaseX = 58;
        const tvSpacing = 38;

        //Draw title for TV data
        page.drawText("T V    O P T I O N S", {
          x: 105,
          y: 266,
          size: 12,
          font: graphieSemiBold,
          color: rgb(0.263, 0.306, 0.631)
        });
        page.drawText("Live TV & Streaming Services for Roku & IOS devices", {
          x: 60,
          y: 252,
          size: 9,
          font: graphieBold,
          color: rgb(0.55, 0.55, 0.55)
        });
        
        for (let i = 0; i < tvAddons.length; i++) {
          const addon = tvAddons[i];
          const currentY = tvBaseY - (i * tvSpacing);

          // Draw title
          page.drawText(addon.title, {
            x: tvBaseX,
            y: currentY,
            size: 16,
            font: graphieBold,
            color: rgb(0, 0, 0)
          });

          // Draw subtitle
          page.drawText(addon.subtitle, {
            x: tvBaseX,
            y: currentY - 13,
            size: 10,
            font: graphieSemiBold,
            color: rgb(0.98, 0.686, 0.094)
          });

          // Calculate total width needed for price section
          const priceText = addon.amount;
          const dollarWidth = getTextWidth('$', graphieBold, 16);
          const priceWidth = getTextWidth(priceText, graphieBold, 16);
          const perMonthWidth = getTextWidth('/mo', graphieBold, 9);
          const totalWidth = dollarWidth + priceWidth + 5 + perMonthWidth; // 5 is spacing between price and /mo

          // Right align the entire price section at x=500
          const rightEdge = 268;
          const priceStartX = rightEdge - totalWidth;

          page.drawText("$" + priceText, {
            x: priceStartX + dollarWidth + 2,
            y: currentY,
            size: 16,
            font: graphieBold,
            color: rgb(0, 0, 0)
          });

          page.drawText('/mo', {
            x: priceStartX + dollarWidth + priceWidth + 12,
            y: currentY + 5,
            size: 9,
            font: graphieBold,
            color: rgb(0, 0, 0)
          });
        }
      } else {
        // Set White image to remove background
        page.drawImage(removerImage, {
          x: 0,
          y: 0,
          width: 280,
          height: 290,
        });
        // Draw cheetah image if no TV data
        const cheetahWidth = 218;
        const cheetahHeight = 277;
        page.drawImage(cheetahImage, {
          x: 0,
          y: 0,
          width: cheetahWidth,
          height: cheetahHeight
        });
      }
    }

    return await pdfDoc.save();
  } catch (error) {
    console.error('Error modifying PDF:', error);
    throw error;
  }
}

//GET test endpoint
app.get('/', async (req, res) => {
  console.log('Live test...');
  res.send('Live test...')
})

// GET endpoint
app.get('/generate-pdf', async (req, res) => {
  const clientIP = req.ip; // Get the client's IP address
  console.log('GET-Client IP:', clientIP);
  try {
    const { domain, includedSpeed, includedUnits } = req.query;
    
    // Parse additional speeds from query params
    const additionalSpeeds = [];
    for (let i = 1; i <= 3; i++) {
      if (req.query[`speed${i}`]) {
        additionalSpeeds.push({
          speed: req.query[`speed${i}`],
          units: req.query[`units${i}`],
          price: req.query[`price${i}`]
        });
      }
    }

    // Parse TV addons from query params
    const tv_addons = [];
    for (let i = 1; i <= 3; i++) {
      if (req.query[`tvTitle${i}`]) {
        tv_addons.push({
          title: req.query[`tvTitle${i}`],
          subtitle: req.query[`tvSubtitle${i}`],
          amount: req.query[`tvAmount${i}`]
        });
      }
    }

    const data = {
      domain: domain || 'grove.xiber.net',
      includedSpeed: includedSpeed || '400/400',
      includedUnits: includedUnits || 'MBPS',
      additionalSpeeds,
      tv_addons
    };

    const pdfBytes = await modifyPDF(data);
    
    res.contentType('application/pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error in GET request:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// POST endpoint
app.post('/generate-pdf', async (req, res) => {
  const clientIP = req.ip; // Get the client's IP address
  console.log('POST-Client IP:', clientIP);
  try {
    const data = {
      domain: req.body.domain || 'grove.xiber.net',
      includedSpeed: req.body.includedSpeed || '400/400',
      includedUnits: req.body.includedUnits || 'MBPS',
      additionalSpeeds: req.body.additionalSpeeds || [],
      tv_addons: req.body.tv_addons || []
    };

    // Limit to max 3 additional speeds
    if (data.additionalSpeeds.length > 3) {
      data.additionalSpeeds = data.additionalSpeeds.slice(0, 3);
    }

    const pdfBytes = await modifyPDF(data);
    
    res.contentType('application/pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error in POST request:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// New endpoint for JSON file upload
app.post('/upload-json', async (req, res) => {
  const clientIP = req.ip; // Get the client's IP address
  console.log('POST_JSON-Client IP:', clientIP);
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }

    // The name of the input field is "jsonFile"
    const jsonFile = req.files.jsonFile;
    
    if (!jsonFile.name.endsWith('.json')) {
      return res.status(400).json({ error: 'Uploaded file must be a JSON file' });
    }

    // Parse the JSON from the file
    try {
      const jsonData = JSON.parse(jsonFile.data.toString());
      
      const data = {
        domain: jsonData.domain || 'grove.xiber.net',
        includedSpeed: jsonData.includedSpeed || '400/400',
        includedUnits: jsonData.includedUnits || 'MBPS',
        additionalSpeeds: jsonData.additionalSpeeds || [],
        tv_addons: jsonData.tv_addons || []
      };

      // Limit to max 3 additional speeds
      if (data.additionalSpeeds.length > 3) {
        data.additionalSpeeds = data.additionalSpeeds.slice(0, 3);
      }

      const pdfBytes = await modifyPDF(data);
      
      res.contentType('application/pdf');
      res.send(Buffer.from(pdfBytes));
    } catch (parseError) {
      console.error('Error parsing JSON file:', parseError);
      res.status(400).json({ error: 'Invalid JSON format in uploaded file' });
    }
  } catch (error) {
    console.error('Error in file upload:', error);
    res.status(500).json({ error: 'Failed to generate PDF from uploaded file' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 