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
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a Magic: The Gathering card generator. Output responses in JSON format following this schema:"
        },
        {
          role: "user",
          content: `Generate a Magic: The Gathering card with these attributes:
          {
            "name": "string",
            "mana_cost": "string",
            "card_type": "string",
            "subtypes": "array of strings",
            "rarity": "string",
            "attack": "integer (if creature, optional)",
            "defense": "integer (if creature, optional)",
            "abilities": "array of strings",
            "flavor_text": "string",
            "set": "string",
            "artist": "string"
          }
          The response should strictly follow the JSON schema above.`
        }
      ],
      response_format: { type: "json_object" } // ✅ Correct value
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


// { example output from ChatGPT
//   name: 'Eldritch Conjurer',
//   mana_cost: '3U',
//   card_type: 'Creature',
//   subtypes: [ 'Human', 'Wizard' ],
//   rarity: 'Rare',
//   attack: 2,
//   defense: 3,
//   abilities: [
//     'Whenever you cast an instant or sorcery spell, create a 1/1 blue Illusion creature token.',
//     '1U, Sacrifice an Illusion: Draw a card.'
//   ],
//   flavor_text: '"From the aether, mysteries are born."',
//   set: 'Mystical Horizons',
//   artist: 'Anna Steinbauer'
// }

/**
 * Orchestrates text generation, image generation, file saving, and DB saving.
 */
async function generateAndSaveMagicCard(description) {
  try {
    // Step 1: Generate card text
    const cardData = await generateMagicCardText(description);
    console.log(cardData)
    // Step 2: Generate card image
    const imageUrl = await generateMagicCardImage();
    console.log(imageUrl)
    // Step 3: Download image
    const outputDir = path.join(__dirname, './public');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, `${Date.now()}.png`);
    await downloadFile(imageUrl, outputPath);

    // Step 4: Save card to DB
    // console.log(cardData);
    // const savedCard = await createCard(imageUrl, outputPath, cardData);
    cardData['imageUrl'] = imageUrl


    return cardData;
  } catch (error) {
    console.error("Error generating and saving card:", error);
    throw error;
  }
}

module.exports = { generateAndSaveMagicCard };
