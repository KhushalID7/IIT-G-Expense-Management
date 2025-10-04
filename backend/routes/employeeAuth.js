const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
require('dotenv').config();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, managerId } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const exists = await Employee.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Employee already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const employee = await Employee.create({ name, email, password: hashed, managerId });
    const out = { id: employee._id, name: employee.name, email: employee.email, createdAt: employee.createdAt };
    res.status(201).json(out);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const match = await bcrypt.compare(password, employee.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: employee._id, role: 'Employee' }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user: { id: employee._id, name: employee.name, email: employee.email } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
