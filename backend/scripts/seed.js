const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const Admin = require('../models/Admin');
const Manager = require('../models/Manager');
const Employee = require('../models/Employee');

async function main(){
  const uri = process.env.MONGO_URI;
  if(!uri){
    console.error('MONGO_URI not set in environment');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to DB for seeding');

  // create default admin if not exists
  const adminEmail = 'admin@iitg.local';
  let admin = await Admin.findOne({ email: adminEmail });
  if(!admin){
    const hashed = await bcrypt.hash('Admin@123', 10);
    admin = await Admin.create({ name: 'Super Admin', email: adminEmail, password: hashed });
    console.log('Created Admin:', admin.email);
  } else {
    console.log('Admin already exists:', admin.email);
  }

  // create default manager if not exists
  const managerEmail = 'manager@iitg.local';
  let manager = await Manager.findOne({ email: managerEmail });
  if(!manager){
    const hashed = await bcrypt.hash('Manager@123', 10);
    manager = await Manager.create({ name: 'Default Manager', email: managerEmail, password: hashed });
    console.log('Created Manager:', manager.email);
  } else {
    console.log('Manager already exists:', manager.email);
  }

  // create default employee if not exists (assign manager)
  const employeeEmail = 'employee@iitg.local';
  let employee = await Employee.findOne({ email: employeeEmail });
  if(!employee){
    const hashed = await bcrypt.hash('Employee@123', 10);
    employee = await Employee.create({ name: 'Default Employee', email: employeeEmail, password: hashed, managerId: manager ? manager._id : undefined });
    console.log('Created Employee:', employee.email);
  } else {
    console.log('Employee already exists:', employee.email);
  }

  await mongoose.disconnect();
  console.log('Seeding complete');
  process.exit(0);
}

main().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
