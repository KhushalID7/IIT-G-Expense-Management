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
const adminManage = require('./routes/adminManage');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/admin', adminAuth);
app.use('/api/manager', managerAuth);
app.use('/api/employee', employeeAuth);
app.use('/api/auth', authRoutes);
app.use('/api/admin/manage', adminManage);

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

if (!MONGO_URI) {
  console.error('\n❌ MONGO_URI not set in environment - please create a `backend/.env` from `backend/.env.example` and set MONGO_URI (MongoDB connection string) and JWT_SECRET.');
  console.error('   Example: MONGO_URI=mongodb+srv://<user>:<pw>@cluster0.mongodb.net/expense_db?retryWrites=true&w=majority');
  // Exit with non-zero so that dev tooling (nodemon) shows failure
  process.exit(1);
}

// Basic validation of URI scheme to catch common mistakes early
if (!MONGO_URI.startsWith('mongodb://') && !MONGO_URI.startsWith('mongodb+srv://')) {
  console.error('\n❌ MONGO_URI appears invalid: expected URI to start with "mongodb://" or "mongodb+srv://"');
  console.error('   Check backend/.env and ensure you copied the full connection string (replace any <placeholders> like <db_password>).');
  console.error('   Example valid prefix: mongodb+srv://username:password@cluster0.mongodb.net/yourdbname');
  process.exit(1);
}

// Detect common template placeholders (e.g. <db_password>) to provide a clearer hint
if (MONGO_URI.includes('<') || MONGO_URI.includes('>') || MONGO_URI.toLowerCase().includes('password') && MONGO_URI.includes('<')) {
  console.error('\n❌ MONGO_URI contains placeholder tokens. Replace placeholders in backend/.env with your actual connection values.');
  console.error('   Example: MONGO_URI=mongodb+srv://dbuser:superSecretPassword@cluster0.mongodb.net/expense_db?retryWrites=true&w=majority');
  process.exit(1);
}

// Connect to MongoDB first, then start the HTTP server only on success.
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
