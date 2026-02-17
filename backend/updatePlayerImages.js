// Script to update player images from local files
// Usage: node updatePlayerImages.js

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const Player = require('./models/Player');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ipl-team-website')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mapping of player names to local image files (without extension)
const playerImageMap = {
  // Batters
  "Ajinkya Rahane": "ajinkya-rahane-3",
  "Rinku Singh": "rinku-singh-28",
  "Angkrish Raghuvanshi": "angkrish-raghuvanshi-21",
  "Manish Pandey": "manish-pandey-18",
  "Cameron Green": "cameron-green-77",
  "Finn Allen": "finn-allen-52",
  "Tejasvi Singh": "tejasvi-singh-66",
  "Rahul Tripathi": "rahul-tripathi-23",
  "Tim Seifert": "tim-seifert-55",
  "Rovman Powell": "rovman-powell-27",
  
  // All-Rounders
  "Anukul Roy": "anukul-roy-44",
  "Sarthak Ranjan": "sarthak-ranjan-88",
  "Daksh Kamra": "daksh-kamra-91",
  "Rachin Ravindra": "rachin-ravindra-48",
  "Ramandeep Singh": "ramandeep-singh-17",
  
  // Bowlers
  "Vaibhav Arora": "vaibhav-arora-39",
  "Matheesha Pathirana": "matheesha-pathirana-99",
  "Kartik Tyagi": "kartik-tyagi-54",
  "Prashant Solanki": "prashant-solanki-73",
  "Akash Deep": "akash-deep-87",
  "Harshit Rana": "harshit-rana-19",
  "Umran Malik": "umran-malik-58",
  "Sunil Narine": "sunil-narine-74",
  "Varun Chakaravarthy": "varun-chakaravarthy-29"
};

async function updatePlayerImages() {
  try {
    console.log('Starting player image update...\n');
    
    const players = await Player.find();
    let updated = 0;
    let skipped = 0;
    
    for (const player of players) {
      const imageFileBase = playerImageMap[player.name];
      
      if (!imageFileBase) {
        console.log(`⚠️  No mapping found for: ${player.name}`);
        skipped++;
        continue;
      }
      
      // Check for image with different extensions (.avif, .jpg, .jpeg, .png)
      const extensions = ['.avif', '.jpg', '.jpeg', '.png'];
      let foundImage = null;
      let foundExtension = null;
      
      for (const ext of extensions) {
        const imagePath = path.join(__dirname, '../frontend/public/images/players', imageFileBase + ext);
        if (fs.existsSync(imagePath)) {
          foundImage = imagePath;
          foundExtension = ext;
          break;
        }
      }
      
      if (foundImage) {
        // Update to use local image
        const localImageUrl = `/images/players/${imageFileBase}${foundExtension}`;
        player.profileImage = localImageUrl;
        await player.save();
        console.log(`✅ Updated ${player.name} → ${localImageUrl}`);
        updated++;
      } else {
        console.log(`⚠️  Image file not found for ${player.name}: ${imageFileBase}.(avif|jpg|jpeg|png)`);
        skipped++;
      }
    }
    
    console.log(`\n✅ Update complete!`);
    console.log(`   Updated: ${updated} players`);
    console.log(`   Skipped: ${skipped} players`);
    console.log(`\nNote: Skipped players are still using external URLs.`);
    
  } catch (error) {
    console.error('Error updating player images:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the update
updatePlayerImages();
