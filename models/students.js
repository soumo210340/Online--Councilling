const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  score: Number,
  preferences: [String], // Array of college-subject IDs (ordered by preference)
});

module.exports = mongoose.model('Student', studentSchema);
