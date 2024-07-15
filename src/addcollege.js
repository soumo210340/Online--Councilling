const express = require('express');
const College = require('../models/college'); // Ensure this import is correct
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

  await newCollege.save();
  res.send('College added successfully');
});

module.exports = router;
