const { Card } = require('./models'); // Instead of './models/Card'


// Function to insert a user
async function createCard(url, filepath, text) {
    try {
        const card = await Card.create({ url, filepath, text });
        console.log('User created:', card.toJSON());
    } catch (error) {
        console.error('Error creating card:', error);
    }
}

// Function to update a card by ID
async function updateCard(cardId, updates) {
    try {
        const card = await Card.findByPk(cardId); // Find the card by primary key
        if (!card) {
            console.log(`Card with ID ${cardId} not found.`);
            return null;
        }

        await card.update(updates); // Update the card with new values
        console.log(`Card ${cardId} updated successfully!`, card.toJSON());

        return card;
    } catch (error) {
        console.error('Error updating card:', error);
    }
}

// // Example Usage
// (async () => {
//     await updateCard(1, { title: 'Updated Title', status: 'completed' });
// })();


// Function to get all users
async function getCards() {
    try {
        const users = await Card.findAll();
        console.log('Card:', users.map(card => card.toJSON()));
    } catch (error) {
        console.error('Error fetching cards:', error);
    }
}

// // Example Usage
// (async () => {
//     await createUser('Alice', 'alice@example.com');
//     await getUsers();
// })();

module.exports = {
    createCard,
    updateCard,
    getCards
};
