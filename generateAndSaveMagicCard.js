const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { createCard } = require('./dbOperations');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generates text for a Magic: The Gathering card using OpenAI.
 */
async function generateMagicCardText(description) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a Magic: The Gathering card generator. Output responses in JSON format."
        },
        {
          role: "user",
          content: `Generate a Magic: The Gathering card with these attributes:
          - Mana Cost
          - Card Type
          - Attack/Defense (if applicable)
          - Card Text
          - Flavor Text.
          Description of the card: ${description}`
        }
      ],
      response_format: "json",
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error generating card text:", error);
    throw error;
  }
}

/**
 * Generates an image for the Magic card using OpenAI DALL-E.
 */
async function generateMagicCardImage() {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A fearsome wizard, fantasy trading card style",
      n: 1,
      size: "1024x1024",
    });

    return response.data[0].url;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

/**
 * Downloads a file from a URL and saves it locally.
 */
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download file: ${response.statusCode}`));
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close(() => resolve(outputPath));
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Cleanup on error
      reject(err);
    });
  });
}

/**
 * Orchestrates text generation, image generation, file saving, and DB saving.
 */
async function generateAndSaveMagicCard(description) {
  try {
    // Step 1: Generate card text
    const cardData = await generateMagicCardText(description);

    // Step 2: Generate card image
    const imageUrl = await generateMagicCardImage();

    // Step 3: Download image
    const outputDir = path.join(__dirname, './public');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, `${Date.now()}.png`);
    await downloadFile(imageUrl, outputPath);

    // Step 4: Save card to DB
    const savedCard = await createCard(imageUrl, outputPath, cardData);

    return savedCard;
  } catch (error) {
    console.error("Error generating and saving card:", error);
    throw error;
  }
}

module.exports = { generateAndSaveMagicCard };
