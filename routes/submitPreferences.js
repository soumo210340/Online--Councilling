const express = require('express');
const router = express.Router();
const StudentChoice = require('../models/studentChoice');
const CollegeCollection = require('../models/colleges');

// Handle preference submission
router.post('/submitPreferences', async (req, res) => {
  const { studentId, preferences } = req.body;

  try {
    // Save preferences to the database
    const studentChoice = await StudentChoice.findOneAndUpdate(
      { studentId }, // Find existing preferences
      { studentId, choices: preferences }, // Update or set new preferences
      { upsert: true, new: true } // Create new document if it doesn't exist
    );

    res.redirect('/viewAllotedCollege'); // Redirect to view allotted colleges
  } catch (err) {
    console.error('Error saving preferences:', err);
    res.status(500).send('Error saving your preferences.');
  }
});

module.exports = router;
