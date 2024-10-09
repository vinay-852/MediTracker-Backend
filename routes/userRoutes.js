const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import User model
const Schedule = require('../models/schedule'); // Import Schedule model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Set the decoded user data in request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// User registration route
router.post('/register', async (req, res) => {
  const { username, email, password, phone, gender } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create new user
  const newUser = new User({
    username,
    email,
    password,
    phone,
    gender,
    logs: [] // Initialize logs array
  });

  await newUser.save();

  // Create empty schedule for the new user
  const newSchedule = new Schedule({
    userId: newUser._id, // Link schedule to user
    compartments: {
      compartment1: [],
      compartment2: [],
      compartment3: [],
      compartment4: []
    }
  });

  await newSchedule.save();

  // Create JWT token
  const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      gender: newUser.gender,
    },
    token,
  });
});

// User login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'Invalid email or password' });
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(404).json({ message: 'Invalid email or password' });
  }

  // Create JWT token
  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({
    message: 'Logged in successfully',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
    },
    token,
  });
});

// Get user profile (protected route)
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password'); // Exclude the password from response

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

// Get user logs (protected route)
router.get('/logs', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('logs'); // Select only logs

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user.logs);
});

// Add data to user logs (protected route)
router.post('/logs', protect, async (req, res) => {
  const { compartment, openedAt } = req.body;

  if (!compartment || !openedAt) {
    return res.status(400).json({ message: 'Compartment and openedAt are required' });
  }

  try {
    // Find the user by ID
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add new log entry to logs array
    user.logs.push({ compartment, openedAt });

    // Save updated user document
    await user.save();

    res.status(201).json({ message: 'Log added successfully', logs: user.logs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
// Reset user logs (protected route)
router.delete('/logs/reset', protect, async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clear the logs array
    user.logs = [];

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Logs reset successfully', logs: user.logs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
