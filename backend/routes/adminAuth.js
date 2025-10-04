const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
require('dotenv').config();

// Register Admin
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Admin already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashed });
    const out = { id: admin._id, name: admin.name, email: admin.email, createdAt: admin.createdAt };
    res.status(201).json(out);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Login Admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, role: 'Admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
