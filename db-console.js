const db = require('./database'); // Your Sequelize instance
const Card = require('./models/Card');

async function start() {
    try {
        await db.sync(); // Ensure database is connected

        // Fetch all cards
        const cards = await Card.findAll();

        // Print the results
        console.log('All Cards:', cards.map(card => card.toJSON()));

        process.exit(); // Exit after printing
    } catch (error) {
        console.error('Error fetching cards:', error);
        process.exit(1); // Exit with an error code
    }
}

start();
