const { OpenAI } = require('openai');  // Import the OpenAI class

// Initialize the OpenAI client with the API key
const openai = new OpenAI({
  apiKey: 'YOUR_OPENAI_API_KEY',  // Replace with your actual API key
});

async function generateImage() {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: 'a white siamese cat',
      n: 1,
      size: '1024x1024',
    });

    console.log(response.data[0].url);
  } catch (error) {
    console.error('Error generating image:', error);
  }
}

generateImage();
