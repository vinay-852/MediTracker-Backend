const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema for individual log entries
const userLogSchema = new mongoose.Schema({
  compartment: {
    type: String,
    required: true,
  },
  openedAt: {
    type: Date,
    required: true,
  },
});

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: [true, "Username already exists"],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email already Used"],
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phone: {
    type: String,
    required: true,
    unique: [true, "Phone number already used"],
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  logs: [userLogSchema], // Array of log entries
});

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;