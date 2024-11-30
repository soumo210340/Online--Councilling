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
    // Find the user in the database
    const user = await LogInCollection.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!Array.isArray(preferences) || preferences.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty preferences array' });
    }

    // Map and update the selectedColleges array
    user.selectedColleges = preferences.map(pref => {
      if (!pref.collegeId || !mongoose.Types.ObjectId.isValid(pref.collegeId)) {
        throw new Error(`Invalid collegeId: ${pref.collegeId}`);
      }
      return mongoose.Types.ObjectId(pref.collegeId);
    });

    // Save the updated user document
    await user.save();

    // Perform matchmaking logic
    await performMatchmaking(userId, preferences);

    // Redirect to allocated colleges or send success response
    res.redirect(`/alloted-colleges?userId=${userId}`);
  } catch (error) {
    console.error('Error during preference submission:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
