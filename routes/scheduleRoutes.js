const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule');
const protect = require('../middleware/authMiddleware');

// Fetch schedule for a user
router.get('/', protect, async (req, res) => {
  const schedule = await Schedule.findOne({ userId: req.user.id });
  if (!schedule) {
    return res.status(404).json({ message: 'Schedule not found' });
  }
  res.json(schedule);
});

// Add task to compartment
router.post('/:compartment', protect, async (req, res) => {
  const { compartment } = req.params;
  const { name, time } = req.body;

  const schedule = await Schedule.findOne({ userId: req.user.id });
  if (!schedule) {
    return res.status(404).json({ message: 'Schedule not found' });
  }

  // Ensure compartments is an object
  if (typeof schedule.compartments !== 'object' || schedule.compartments === null) {
    schedule.compartments = {};
  }

  // Initialize compartment array if it does not exist
  if (!Array.isArray(schedule.compartments[compartment])) {
    schedule.compartments[compartment] = [];
  }

  schedule.compartments[compartment].push({ name, time });
  await schedule.save();
  res.json(schedule);
});

// Delete task from compartment
router.delete('/:compartment/:index', protect, async (req, res) => {
  const { compartment, index } = req.params;

  const schedule = await Schedule.findOne({ userId: req.user.id });
  if (!schedule) {
    return res.status(404).json({ message: 'Schedule not found' });
  }

  schedule.compartments[compartment].splice(index, 1);
  await schedule.save();
  res.json(schedule);
});

module.exports = router;
