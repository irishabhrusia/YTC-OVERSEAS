// server/scripts/seedAdmin.js
// Seeds initial super_admin from environment variables

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
  const name = process.env.SEED_ADMIN_NAME;
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!name || !email || !password) {
    console.error(
      'Error: SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, and SEED_ADMIN_PASSWORD must all be defined in .env'
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Error: SEED_ADMIN_PASSWORD must be at least 8 characters long');
    process.exit(1);
  }

  try {
    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });

    if (existingAdmin) {
      console.log(
        `Admin account already exists for ${normalizedEmail} (Role: ${existingAdmin.role})`
      );
      await mongoose.disconnect();
      process.exit(0);
    }

    const newAdmin = await Admin.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'super_admin',
      isActive: true,
      mustChangePassword: true,
    });

    console.log(
      `Super admin account created successfully! Name: ${newAdmin.name}, Email: ${newAdmin.email}, Role: ${newAdmin.role}`
    );

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error creating super admin:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();

