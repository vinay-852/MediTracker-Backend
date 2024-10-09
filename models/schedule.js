// models/schedule.js
const mongoose = require('mongoose');

const compartmentSchema = new mongoose.Schema({
  time: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: Boolean, default: true },
});

const scheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  compartments: {
    compartment1: [compartmentSchema],
    compartment2: [compartmentSchema],
    compartment3: [compartmentSchema],
    compartment4: [compartmentSchema],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
