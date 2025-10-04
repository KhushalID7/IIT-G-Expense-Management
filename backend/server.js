const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const adminAuth = require('./routes/adminAuth');
const managerAuth = require('./routes/managerAuth');
const employeeAuth = require('./routes/employeeAuth');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/admin', adminAuth);
app.use('/api/manager', managerAuth);
app.use('/api/employee', employeeAuth);
app.use('/api/auth', authRoutes);

const MONGO_URI = process.env.MONGO_URI || '';
if (!MONGO_URI) {
  console.error('MONGO_URI not set in environment - check .env');
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
