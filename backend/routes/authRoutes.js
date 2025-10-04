const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Manager = require('../models/Manager');
const Employee = require('../models/Employee');
require('dotenv').config();

// ✅ Admin fixed credentials
const ADMIN_EMAIL = 'iitgadmin@gmail.com';
const ADMIN_PASSWORD = 'adminiit';

// Role-based login
router.post('/login', async (req, res) => {
  const { role, email, password } = req.body;

  try {
    // normalize role
    const r = (role || '').toString().toLowerCase();

    // 🔹 ADMIN LOGIN (Fixed credentials)
    if (r === 'admin') {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        return res.status(200).json({ message: 'Admin login successful', redirectTo: '/admin' });
      } else {
        return res.status(401).json({ message: 'Wrong credentials for Admin' });
      }
    }

    // 🔹 MANAGER LOGIN
    if (r === 'manager') {
      const manager = await Manager.findOne({ email });
      if (!manager) return res.status(404).json({ message: 'Register first' });

      const match = await bcrypt.compare(password, manager.password);
      if (!match) return res.status(401).json({ message: 'Wrong credentials' });

      return res.status(200).json({ message: 'Manager login successful', redirectTo: '/manager' });
    }

    // 🔹 EMPLOYEE LOGIN
    if (r === 'employee') {
      const employee = await Employee.findOne({ email });
      if (!employee) return res.status(404).json({ message: 'Register first' });

      const match = await bcrypt.compare(password, employee.password);
      if (!match) return res.status(401).json({ message: 'Wrong credentials' });

      return res.status(200).json({ message: 'Employee login successful', redirectTo: '/employee' });
    }

    res.status(400).json({ message: 'Invalid role' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Register for Manager or Employee
router.post('/register', async (req, res) => {
  const { role, name, email, password } = req.body;

  try {
    if (!role || !name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const r = role.toString().toLowerCase();
    const hashed = await bcrypt.hash(password, 10);

    if (r === 'manager') {
      const exists = await Manager.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Manager already exists' });
      const newManager = await Manager.create({ name, email, password: hashed });
      return res.status(201).json({ message: 'Manager registered', user: { id: newManager._id, email: newManager.email, name: newManager.name } });
    }

    if (r === 'employee') {
      const exists = await Employee.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Employee already exists' });
      const newEmployee = await Employee.create({ name, email, password: hashed });
      return res.status(201).json({ message: 'Employee registered', user: { id: newEmployee._id, email: newEmployee.email, name: newEmployee.name } });
    }

    res.status(400).json({ message: 'Invalid role' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
