document.getElementById('card-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the default form submission

  const color = document.getElementById('color').value;
  const type = document.getElementById('type').value;
  const effect = document.getElementById('effect').value;

  try {
    const response = await fetch('http://localhost:3000/generate-card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ color, type, effect }),
    });

    const data = await response.json();

    // Display the generated card details
    document.getElementById('card-image').src = data.imageUrl;
    document.getElementById('card-name').textContent = `Name: ${data.name}`;
    document.getElementById('card-text').textContent = `Text: ${data.text}`;
    document.getElementById('card-flavor').textContent = `Flavor Text: ${data.flavorText}`;

    // Display the generated card section
    document.getElementById('generated-card').style.display = 'block';
  } catch (error) {
    console.error('Error generating card:', error);
  }
});