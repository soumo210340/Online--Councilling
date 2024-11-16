const express = require('express');
const College = require('../models/colleges');
const router = express.Router();

// Admin Dashboard Route
router.get('/admin', (req, res) => {
  res.render('admin');
});

router.post('/admin', async (req, res) => {
  const { name, location, courses, establishedYear, minMarks, maxMarks } = req.body;

  const newCollege = new College({
    name,
    location,
    courses: courses.split(','), // Split the courses into an array
    establishedYear,
    minMarks,
    maxMarks,
  });

  try {
    await newCollege.save();
    res.send('College added successfully');
  } catch (error) {
    console.error('Error adding college:', error);
    res.send(`Failed to add college: ${error.message}`);
  }
});

module.exports = router;
