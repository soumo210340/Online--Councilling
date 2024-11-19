const express = require('express');
const router = express.Router();
const College = require('../models/college'); // Ensure you have a college model

// Route to render the admin college addition page
router.get('/admin/add-college', (req, res) => {
  res.render('addCollege'); // Render the admin page to add colleges
});

// Route to handle form submission for adding a new college
router.post('/admin/add-college', async (req, res) => {
  try {
    const { name, location, courses, establishedYear } = req.body;

    // Create a new college document
    const newCollege = new College({
      name,
      location,
      courses: courses.split(',').map((course) => course.trim()), // Convert courses to an array
      establishedYear,
    });

    // Save to database
    await newCollege.save();
    res.redirect('/admin/add-college'); // Redirect back to the admin page
  } catch (err) {
    console.error('Error adding college:', err);
    res.status(500).send('Error adding college');
  }
});

module.exports = router;
