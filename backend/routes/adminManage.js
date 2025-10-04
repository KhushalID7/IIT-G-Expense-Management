const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Manager = require('../models/Manager');
const Employee = require('../models/Employee');
require('dotenv').config();

// NOTE: These endpoints are meant for admin use. For simplicity they are
// currently unprotected; in production wrap with verifyToken + role check.

// GET /api/admin/manage/users
// Return combined list of admins/managers/employees with manager name populated
router.get('/users', async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').lean();
    const managers = await Manager.find().select('-password').lean();
    const employees = await Employee.find().populate('managerId', 'name').select('-password').lean();

    const mappedAdmins = admins.map((a) => ({ id: a._id, name: a.name, email: a.email, role: 'admin' }));
    const mappedManagers = managers.map((m) => ({ id: m._id, name: m.name, email: m.email, role: 'manager' }));
  const mappedEmployees = employees.map((e) => ({ id: e._id, name: e.name, email: e.email, role: 'employee', manager: e.managerId ? e.managerId.name : undefined, managerId: e.managerId ? (e.managerId._id || e.managerId.id) : undefined }));

    const combined = [...mappedAdmins, ...mappedManagers, ...mappedEmployees];
    res.json({ users: combined });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/manage/users
// Create a new user in the requested role
router.post('/users', async (req, res) => {
  try {
    const { role, name, email, password, managerId } = req.body;
    if (!role || !name || !email) return res.status(400).json({ message: 'Missing fields' });

    const r = role.toString().toLowerCase();
    // Require password when admin creates users (manager/employee/admin)
    if (!password || typeof password !== 'string' || password.trim().length < 6) {
      return res.status(400).json({ message: 'Password is required and must be at least 6 characters' });
    }

    const hashed = await bcrypt.hash(password, 10);

    if (r === 'admin') {
      const exists = await Admin.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Admin already exists' });
      const a = await Admin.create({ name, email, password: hashed });
      return res.status(201).json({ id: a._id, name: a.name, email: a.email, role: 'admin' });
    }

    if (r === 'manager') {
      const exists = await Manager.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Manager already exists' });
      const m = await Manager.create({ name, email, password: hashed });
      return res.status(201).json({ id: m._id, name: m.name, email: m.email, role: 'manager' });
    }

    if (r === 'employee') {
      const exists = await Employee.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Employee already exists' });
      const e = await Employee.create({ name, email, password: hashed, managerId: managerId || undefined });
      return res.status(201).json({ id: e._id, name: e.name, email: e.email, role: 'employee', manager: undefined });
    }

    res.status(400).json({ message: 'Invalid role' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/manage/users/:id
// Update a user's role or manager reference. If role changes, move document between collections.
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role, name, email, managerId, password } = req.body;
    // find existing
    let doc = await Admin.findById(id) || await Manager.findById(id) || await Employee.findById(id);
    if (!doc) return res.status(404).json({ message: 'User not found' });

    const currentRole = (await Admin.findById(id)) ? 'admin' : (await Manager.findById(id)) ? 'manager' : 'employee';
    const targetRole = role ? role.toString().toLowerCase() : currentRole;

    // If password provided, validate and hash
    let newPasswordHash = null;
    if (password) {
      if (typeof password !== 'string' || password.trim().length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      newPasswordHash = await bcrypt.hash(password, 10);
    }

    // If role unchanged, update fields in place
    if (targetRole === currentRole) {
      if (currentRole === 'admin') {
        const payload = { name, email };
        if (newPasswordHash) payload.password = newPasswordHash;
        const upd = await Admin.findByIdAndUpdate(id, payload, { new: true }).select('-password');
        return res.json({ id: upd._id, name: upd.name, email: upd.email, role: 'admin' });
      }
      if (currentRole === 'manager') {
        const payload = { name, email };
        if (newPasswordHash) payload.password = newPasswordHash;
        const upd = await Manager.findByIdAndUpdate(id, payload, { new: true }).select('-password');
        return res.json({ id: upd._id, name: upd.name, email: upd.email, role: 'manager' });
      }
      if (currentRole === 'employee') {
  const payload = { name, email, managerId: managerId || undefined };
        if (newPasswordHash) payload.password = newPasswordHash;
        const upd = await Employee.findByIdAndUpdate(id, payload, { new: true }).select('-password');
        const populated = await upd.populate('managerId', 'name');
        return res.json({ id: populated._id, name: populated.name, email: populated.email, role: 'employee', manager: populated.managerId ? populated.managerId.name : undefined });
      }
    }

    // Role change: copy document to target collection and remove old
    const passwordHash = newPasswordHash || doc.password;
    if (targetRole === 'admin') {
      const created = await Admin.create({ name: name || doc.name, email: email || doc.email, password: passwordHash });
      // remove old
      if (currentRole === 'manager') await Manager.findByIdAndDelete(id);
      if (currentRole === 'employee') await Employee.findByIdAndDelete(id);
      return res.json({ id: created._id, name: created.name, email: created.email, role: 'admin' });
    }

    if (targetRole === 'manager') {
      const created = await Manager.create({ name: name || doc.name, email: email || doc.email, password: passwordHash });
      if (currentRole === 'admin') await Admin.findByIdAndDelete(id);
      if (currentRole === 'employee') await Employee.findByIdAndDelete(id);
      return res.json({ id: created._id, name: created.name, email: created.email, role: 'manager' });
    }

    if (targetRole === 'employee') {
      const created = await Employee.create({ name: name || doc.name, email: email || doc.email, password: passwordHash, managerId: managerId || undefined });
      if (currentRole === 'admin') await Admin.findByIdAndDelete(id);
      if (currentRole === 'manager') await Manager.findByIdAndDelete(id);
      return res.json({ id: created._id, name: created.name, email: created.email, role: 'employee', manager: undefined });
    }

    res.status(400).json({ message: 'Invalid target role' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/manage/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByIdAndDelete(id);
    if (admin) return res.json({ message: 'Admin deleted' });
    const manager = await Manager.findByIdAndDelete(id);
    if (manager) return res.json({ message: 'Manager deleted' });
    const employee = await Employee.findByIdAndDelete(id);
    if (employee) return res.json({ message: 'Employee deleted' });
    res.status(404).json({ message: 'User not found' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
