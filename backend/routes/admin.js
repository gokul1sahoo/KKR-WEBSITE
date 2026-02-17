const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const { authMiddleware, generateToken } = require('../middleware/auth');

// @route   POST /api/admin/login
// @desc    Login admin
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(admin._id);

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/admin/me
// @desc    Get current admin
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  res.json({
    admin: {
      id: req.admin._id,
      username: req.admin.username,
      email: req.admin.email,
      role: req.admin.role
    }
  });
});

// @route   POST /api/admin/register
// @desc    Create new admin (only super-admin can do this)
// @access  Private
router.post('/register', authMiddleware, async (req, res) => {
  try {
    // Check if requester is super-admin
    if (req.admin.role !== 'super-admin') {
      return res.status(403).json({ error: 'Only super-admin can create new admins' });
    }

    const { username, email, password, role } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin with this email or username already exists' });
    }

    // Create new admin
    const admin = new Admin({ username, email, password, role: role || 'admin' });
    await admin.save();

    res.status(201).json({ 
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
