const express = require('express');
const mongoose = require('mongoose');
const LogInCollection = require('../src/mongo'); // Adjust path if needed
const performMatchmaking = require('../utils/matchmaking'); // Matchmaking logic

const router = express.Router(); // Initialize router

// Handle Preference Submission
router.post('/submit-preferences', async (req, res) => {
  const { userId, preferences } = req.body; // Ensure preferences is extracted from the request body

  console.log('Request body received:', req.body); // Log the entire request body for debugging
  console.log('Received User ID:', userId); // Log the userId for debugging
  console.log('MongoDB connection state:', mongoose.connection.readyState); // Log MongoDB connection state for debugging

  if (!preferences) {
    return res.status(400).json({ error: 'Preferences are required.' });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid User ID' });
  }

  try {
    // Find the user in the database
    const user = await LogInCollection.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Transform preferences into an array of objects with collegeId and priority
    const transformedPreferences = Object.entries(preferences).map(([collegeId, priority]) => ({
      collegeId,
      priority: parseInt(priority, 10),
    }));

    // Validate transformed preferences
    if (transformedPreferences.some(pref => !pref.collegeId || isNaN(pref.priority) || pref.priority <= 0)) {
      return res.status(400).json({ error: 'Invalid preferences. Ensure all priorities are positive numbers.' });
    }

    user.selectedColleges = transformedPreferences; // Store the array of preferences with priorities
    await user.save();

    // Perform matchmaking (if applicable)
    await performMatchmaking(userId, preferences);

    // ✅ Return a JSON response instead of rendering a page
    res.status(200).json({
      success: true,
      message: 'Preferences submitted successfully. Thank you!',
      redirectUrl: '/success' // You can handle this on the frontend
    });

  } catch (error) {
    console.error('Error during preference submission:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
