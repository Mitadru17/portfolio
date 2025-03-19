const https = require('https');
const fs = require('fs');
const path = require('path');

// URL for a placeholder image of a cyberpunk hooded figure with red neon circle
// This is just a placeholder - you'll need to replace it with the actual image you want
const imageUrl = 'https://img.freepik.com/free-photo/mysterious-hooded-person-night-cyberpunk-style-generated-by-ai_24640-98417.jpg';

const imagePath = path.join(__dirname, 'public', 'images', 'cyberpunk_figure.png');

console.log(`Downloading image to ${imagePath}...`);

// Ensure the directory exists
const dir = path.dirname(imagePath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Download the image
const file = fs.createWriteStream(imagePath);
https.get(imageUrl, response => {
  response.pipe(file);
  
  file.on('finish', () => {
    file.close();
    console.log('Image downloaded successfully');
  });
}).on('error', err => {
  fs.unlink(imagePath, () => {}); // Delete the file if there's an error
  console.error(`Error downloading image: ${err.message}`);
}); 