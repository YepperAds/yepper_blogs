// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Auto-create default admin if none exists
const ensureDefaultAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({});
    if (!adminExists) {
      const defaultAdmin = new Admin({
        username: 'admin',
        password: 'admin123', // Default password
        isSetup: false // Mark as not fully setup
      });
      await defaultAdmin.save();
      console.log('Default admin account created: admin/admin123');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

// Check if admin exists and setup status
router.get('/check-setup', async (req, res) => {
  try {
    await ensureDefaultAdmin(); // Ensure default admin exists
    const admin = await Admin.findOne({});
    res.json({ 
      setupComplete: admin ? admin.isSetup : false,
      defaultCredentials: admin && !admin.isSetup ? {
        username: 'admin',
        password: 'admin123'
      } : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token (for frontend auth check)
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    res.json({
      valid: true,
      admin: {
        id: req.admin._id,
        username: req.admin.username,
        isSetup: req.admin.isSetup
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Complete setup (change from default credentials)
router.post('/complete-setup', authMiddleware, async (req, res) => {
  try {
    const { newUsername, newPassword } = req.body;
    
    if (!newUsername || !newPassword) {
      return res.status(400).json({ message: 'Username and password required' });
    }
    
    const admin = req.admin;
    
    // Update admin credentials
    admin.username = newUsername;
    admin.password = newPassword; // Will be hashed by pre-save middleware
    admin.isSetup = true;
    
    await admin.save();
    
    // Generate new JWT with updated info
    const token = jwt.sign(
      { adminId: admin._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Setup completed successfully',
      token,
      admin: { 
        id: admin._id, 
        username: admin.username,
        isSetup: true 
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Setup completion failed' });
  }
});

// Admin login (works with default or custom credentials)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Ensure default admin exists
    await ensureDefaultAdmin();
    
    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { adminId: admin._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      admin: { 
        id: admin._id, 
        username: admin.username,
        isSetup: admin.isSetup
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Legacy setup route (kept for backward compatibility)
router.post('/setup', async (req, res) => {
  try {
    const { username, password, setupToken } = req.body;
    
    // Verify setup token
    if (setupToken !== process.env.ADMIN_SETUP_TOKEN) {
      return res.status(401).json({ message: 'Invalid setup token' });
    }
    
    // Check if admin already exists and is fully setup
    const existingAdmin = await Admin.findOne({ isSetup: true });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already fully configured' });
    }
    
    // Update existing default admin or create new one
    let admin = await Admin.findOne({});
    if (admin) {
      admin.username = username;
      admin.password = password;
      admin.isSetup = true;
    } else {
      admin = new Admin({
        username,
        password,
        isSetup: true
      });
    }
    
    await admin.save();
    
    // Generate JWT
    const token = jwt.sign(
      { adminId: admin._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'Admin setup successful',
      token,
      admin: { 
        id: admin._id, 
        username: admin.username,
        isSetup: true 
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Setup failed' });
  }
});

module.exports = router;