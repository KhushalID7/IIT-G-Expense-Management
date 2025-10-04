const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Manager', managerSchema);
