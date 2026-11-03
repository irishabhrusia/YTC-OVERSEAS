const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['super_admin', 'counsellor', 'editor'],
        message: '{VALUE} is not a valid role',
      },
      default: 'counsellor',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    mustChangePassword: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password with bcryptjs (12 rounds) only when password is created or modified
adminSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with stored hashed password
adminSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
