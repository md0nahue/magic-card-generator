const OpenAI = require('openai');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;
const cors = require('cors');
const { createCard, updateCard, getCards } = require('./dbOperations');

const { generateAndSaveMagicCard } = require('../services/cardService');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateMagicCard(text) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Use gpt-4o-mini for cost savings
            messages: [
                {
                    role: "system",
                    content: "You are a Magic: The Gathering card generator. Output responses in JSON format."
                },
                {
                    role: "user",
                    content: `Generate a Magic: The Gathering card with these five attributes: \n- Mana Cost\n- Card Type\n- Attack/Defense (if applicable)\n- Card Text\n- Flavor Text. \nEnsure it feels like a real MTG card. Description of the card is ${text}`
                }
            ],
            response_format: "json",
        });

        const cardData = response.choices[0].message.content;

        console.log("Generated Magic Card:", cardData);
    } catch (error) {
        console.error("Error generating card:", error);
    }
}

function downloadFile(url, outputPath) {
    const file = fs.createWriteStream(outputPath);

    https.get(url, (response) => {
        if (response.statusCode !== 200) {
            console.error(`Failed to download file: ${response.statusCode}`);
            return;
        }
        response.pipe(file);

        file.on('finish', () => {
            file.close();
            console.log('Download completed:', outputPath);
        });
    }).on('error', (err) => {
        fs.unlink(outputPath, () => {}); // Cleanup on error
        console.error('Error downloading file:', err.message);
    });
}

app.use(cors());

app.use(bodyParser.json());
app.post('/generate-card', async (req, res) => {

  const { text } = req.body;

  try {
    const savedCard = await generateAndSaveMagicCard(text);
    res.json({ success: true, card: savedCard });
  } catch (error) {
    console.error("Error generating card:", error);
    res.status(500).json({ success: false, error: "Failed to generate card" });
  }
  });

// Route to generate a card based on user input
app.post('/generate-card', async (req, res) => {
  console.log("requesting image now!!!!")

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: "a fearsome wizard",
    n: 1,
    size: "1024x1024",
  });
  console.log(response)
  console.log('done!')

  console.log(response.data[0].url);

  const url = response.data[0].url;
  const outputDir = path.join(__dirname, 'downloads'); // Create 'downloads' folder
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${Math.floor(Date.now())}.png`);
  downloadFile(url, outputPath);
  createCard(url, outputPath, text)

});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use(express.static(path.join(__dirname, 'public')));