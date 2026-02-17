const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('./models/Admin');

async function createInitialAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ipl-team-website');
    console.log('MongoDB connected');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('✅ Admin already exists!');
      console.log(`Username: admin`);
      console.log(`Email: ${existingAdmin.email}`);
      mongoose.connection.close();
      return;
    }

    // Create admin
    const admin = new Admin({
      username: 'admin',
      email: 'admin@kkr.in',
      password: 'password123',
      role: 'super-admin'
    });

    await admin.save();
    console.log('\n✅ Initial admin created successfully!');
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Username: admin');
    console.log('Password: password123');
    console.log('Email: admin@kkr.in');
    console.log('Role: super-admin');
    console.log('\n🔗 Login at: http://localhost:3002/admin/login');
    console.log('\n⚠️  Remember to change the password after first login!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

createInitialAdmin();
