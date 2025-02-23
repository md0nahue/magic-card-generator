document.getElementById('mtg-button').addEventListener('click', async function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get user input
  const color = document.getElementById('color').value;
  const type = document.getElementById('type').value;
  const effect = document.getElementById('effect').value;

  // Prepare the request body
  const requestBody = {
    color,
    type,
    effect
  };

  try {
    // Send a request to the back-end to generate a card
    const response = await fetch('http://localhost:3000/generate-card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error('Failed to generate card');
    }

    const cardData = await response.json();

    // Display the card text and image
    document.getElementById('card-text').innerHTML = `
      <strong>Name:</strong> ${cardData.name}<br>
      <strong>Type:</strong> ${cardData.type}<br>
      <strong>Text:</strong> ${cardData.text}<br>
      <strong>Flavor Text:</strong> ${cardData.flavorText}
    `;
    document.getElementById('card-image').src = cardData.imageUrl;

    // Display the generated card section
    document.getElementById('generated-card').style.display = 'block';
  } catch (error) {
    console.error('Error generating card:', error);
    document.getElementById('error-message').innerText = 'Failed to generate card. Please try again.';
    document.getElementById('error-message').style.display = 'block';
  }
});