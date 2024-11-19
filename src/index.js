require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const LogInCollection = require('./mongo');  // Ensure the correct path is used
const performMatchmaking = require('../utils/matchmaking');
// Import the College model
const College = require('../models/colleges'); // Adjust path to your College model
const app = express();
const port = process.env.PORT || 3000; // Set the port

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public'))); // Serving static files

// Middleware to handle POST data
app.use(express.urlencoded({ extended: true })); // For form submissions
app.use(express.json()); // For JSON data

// Static files
app.use(express.static(path.join(__dirname, '../public'))); // Serving static files

// Set up Handlebars view engine
app.set('views', path.join(__dirname, '../templates'));
app.set('view engine', 'hbs');

// Register existing routes (your routes may be placed below as necessary)
const submitPreferencesRoutes = require('../routes/submitPreferences');
const matchingRoutes = require('../routes/matching');

// Use your routes
app.use(submitPreferencesRoutes);
app.use(matchingRoutes);

// Route to render the Add College form (GET)
app.get('/admin/add-college', (req, res) => {
  res.render('add-college'); // Renders add-college.hbs template
});

// Route to handle form submission (POST)
app.post('/admin/add-college', async (req, res) => {
  const { name, location, courses, establishedYear, marksRange } = req.body;

  // Create a new College document
  const newCollege = new College({
    name,
    location,
    courses,
    establishedYear,
    marksRange
  });

  try {
    // Save the college to the database
    await newCollege.save();
    res.redirect('/admin/add-college');  // Redirect back to the add-college form after successful submission
  } catch (error) {
    console.error('Error adding college:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to render home page with list of colleges
app.get('/home', async (req, res) => {
  const userId = req.query.userId;

  // Validate the userId before proceeding
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send('Invalid User ID');
  }

  try {
    const user = await LogInCollection.findById(userId);
    const colleges = await College.find();  // Fetch all colleges from the database

    if (user) {
      // Render the home page and pass both user data and the list of colleges
      res.render('home', { user, colleges });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error fetching user or colleges:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Root route ("/")
app.get('/', (req, res) => {
  res.render('login'); // Ensure you have a 'login.hbs' template in the 'templates' folder
});

// Render login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Handle login form submission
app.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await LogInCollection.findOne({ name, password });
    if (user) {
      res.redirect(`/home?userId=${user._id}`);
    } else {
      res.status(401).send('Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle college preference submission
app.post('/submit-preferences', async (req, res) => {
  const userId = req.body.userId; // Assuming userId is sent with the form data

  // Validate the userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send('Invalid User ID');
  }

  const selectedColleges = req.body.preferences; // This will be an array of selected colleges with courses

  try {
    const user = await LogInCollection.findById(userId);

    if (user) {
      user.selectedColleges = selectedColleges.map(pref => pref.collegeId); // Save the selected college IDs only
      await user.save(); // Save the updated user preferences

      // Perform matchmaking (this function should implement your matchmaking logic)
      await performMatchmaking(userId, selectedColleges); // Pass the userId and selected preferences to matchmaking logic

      // Redirect to the allotted colleges page
      res.redirect(`/alloted-colleges?userId=${userId}`);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error during preference submission:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Display allotted colleges after matchmaking
app.get('/alloted-colleges', async (req, res) => {
  const userId = req.query.userId;

  // Validate the userId before proceeding
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send('Invalid User ID');
  }

  try {
    const user = await LogInCollection.findById(userId).populate('selectedColleges');

    if (user) {
      // Assuming allotted colleges are based on the selections or matching logic
      const allottedColleges = user.selectedColleges;

      res.render('allotedColleges', { user, allottedColleges });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error fetching allotted colleges:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected');
    // Start the server after database connection
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit process on database connection failure
  });
