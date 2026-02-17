// Script to create the first admin user
// Usage: node createAdmin.js

const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

const Admin = require('./models/Admin');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ipl-team-website')
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function createAdmin() {
  console.log('\n=== Create Admin User ===\n');

  // Prompt for admin details
  rl.question('Enter username: ', (username) => {
    rl.question('Enter email: ', (email) => {
      rl.question('Enter password: ', (password) => {
        rl.question('Enter role (admin/super-admin) [default: super-admin]: ', async (role) => {
          
          try {
            // Check if admin already exists
            const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
            if (existingAdmin) {
              console.log('\n❌ Admin with this email or username already exists!');
              mongoose.connection.close();
              rl.close();
              return;
            }

            // Create admin
            const admin = new Admin({
              username,
              email,
              password,
              role: role || 'super-admin'
            });

            await admin.save();
            console.log('\n✅ Admin created successfully!');
            console.log(`   Username: ${username}`);
            console.log(`   Email: ${email}`);
            console.log(`   Role: ${admin.role}`);
            console.log('\n🔑 You can now login with these credentials at /admin/login\n');

          } catch (error) {
            console.error('\n❌ Error creating admin:', error.message);
          } finally {
            mongoose.connection.close();
            rl.close();
          }
        });
      });
    });
  });
}

// Run the script
createAdmin();
