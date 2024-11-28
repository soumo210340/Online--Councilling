const express = require('express');
const mongoose = require('mongoose');
const LogInCollection = require('../src/mongo'); // Adjust path as necessary
const performMatchmaking = require('../utils/matchmaking'); // Matchmaking logic

const router = express.Router(); // Initialize router

// Handle Preference Submission
router.post('/submit-preferences', async (req, res) => {
  const { userId, preferences } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid User ID' });
  }

  try {
    const user = await LogInCollection.findById(userId).populate('selectedColleges');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!Array.isArray(user.selectedColleges)) {
      user.selectedColleges = []; // Initialize if undefined
    }

    user.selectedColleges = preferences.map(pref => mongoose.Types.ObjectId(pref.collegeId));
    await user.save();

    await performMatchmaking(userId, preferences);

    res.redirect(`/alloted-colleges?userId=${userId}`);
  } catch (error) {
    console.error('Error during preference submission:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
