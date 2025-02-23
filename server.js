const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { generateAndSaveMagicCard } = require('./generateAndSaveMagicCard');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route to generate a Magic: The Gathering card
app.post('/generate-card', async (req, res) => {
    const text  = `${req.body.color} ${req.body.type} ${req.body.effect}`;
        // if (!text) {
    //     return res.status(400).json({ success: false, error: "Missing card description." });
    // }

    try {
        const savedCard = await generateAndSaveMagicCard(text);
        res.json({ success: true, card: savedCard });
    } catch (error) {
        console.error("Error generating card:", error);
        res.status(500).json({ success: false, error: "Failed to generate card." });
    }
});

// Serve main UI page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
