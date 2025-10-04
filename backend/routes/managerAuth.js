const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Manager = require('../models/Manager');
require('dotenv').config();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const exists = await Manager.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Manager already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const manager = await Manager.create({ name, email, password: hashed });
    const out = { id: manager._id, name: manager.name, email: manager.email, createdAt: manager.createdAt };
    res.status(201).json(out);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const manager = await Manager.findOne({ email });
    if (!manager) return res.status(404).json({ message: 'Manager not found' });

    const match = await bcrypt.compare(password, manager.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: manager._id, role: 'Manager' }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user: { id: manager._id, name: manager.name, email: manager.email } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
