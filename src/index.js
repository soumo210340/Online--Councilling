require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const LogInCollection = require('./mongo'); // Ensure correct path
const College = require('../models/colleges'); // Adjust path to College model
const performMatchmaking = require('../utils/matchmaking'); // Ensure correct path to matchmaking
const submitPreferencesRoutes = require('../routes/submitPreferences'); // Submit preferences route
const matchingRoutes = require('../routes/matching'); // Matching routes
const asyncHandler = require('express-async-handler'); // For error handling (optional)
const signupRoute = require('../routes/signup');
const hbs = require('hbs'); // Require hbs

// Register a Handlebars helper to stringify JSON
hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

// Initialize Express
const app = express();
const port = process.env.PORT || 3001; // Changed port back to 3001

// Middleware
app.use(express.urlencoded({ extended: true })); // Form submissions
app.use(express.json()); // JSON data
app.use(express.static(path.join(__dirname, '..', 'public'))); // Serve static files from the 'public' folder
app.set('view engine', 'hbs'); // Ensure Handlebars is used as the view engine
app.set('views', path.join(__dirname, '..', 'templates')); // Correct path to templates

// Routes
app.use('/signup', signupRoute); // singup page 
// app.use(submitPreferencesRoutes); // Temporarily commented out to use the inline route below
app.use(matchingRoutes); // Matching Routes

// Root Route
app.get('/', (req, res) => res.render('login')); // Ensure login.hbs is in templates folder

// Login Page
app.get('/login', (req, res) => res.render('login')); // Ensure login.hbs is in templates folder

// Handle Login
app.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { name, password } = req.body;

    const user = await LogInCollection.findOne({ name, password });
    if (!user) {
      return res.status(401).send('Login failed. Please check your credentials.');
    }

    res.redirect(`/home?userId=${user._id}`);
  })
);

// Render Home Page with Colleges
app.get(
  '/home',
  asyncHandler(async (req, res) => {
    const userId = req.query.userId;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send('Invalid User ID');
    }

    const user = await LogInCollection.findById(userId);
    const colleges = await College.find();

    // Debugging log
    console.log("Received User ID in /home route:", userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('home', { user, colleges });
  })
);

// Admin Add College Form (GET)
app.get('/admin/add-college', (req, res) => {
  res.render('add-college'); // Render add-college.hbs
});

// Admin Add College Form (POST)
app.post(
  '/admin/add-college',
  asyncHandler(async (req, res) => {
    const { name, location, courses, establishedYear, marksRange, capacity } = req.body;

    const newCollege = new College({
      name,
      location,
      courses,
      establishedYear,
      marksRange,
      capacity,
    });

    await newCollege.save();
    res.redirect('/admin/add-college');
  })
);

 // Handle Preference Submission
 
 // Fix for the submit-preferences route
app.post('/submit-preferences', asyncHandler(async (req, res) => {
  const { userId, preferences } = req.body;
  
  // Log received data for debugging
  console.log("Received User ID:", userId);
  console.log("Received Preferences:", preferences);
        
  // Check if preferences is an array
  if (!Array.isArray(preferences)) {
    return res.status(400).json({ error: 'Preferences should be an array of college IDs' });
  }

  // Check if userId is valid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error("Invalid User ID:", userId);
    return res.status(400).json({ error: 'Invalid User ID. Please check the ID and try again.' });
  }

  try {
    const user = await LogInCollection.findById(userId);

    if (!user) {
      console.error("User not found:", userId);
      return res.status(404).json({ error: 'User not found. Please ensure you are logged in.' });
    }

    // Validate preferences structure and values
    if (!preferences.every(p => p.collegeId && mongoose.Types.ObjectId.isValid(p.collegeId) && p.priority && Number.isInteger(p.priority) && p.priority > 0)) {
      console.error("Server-side preference validation failed. Preferences data:", JSON.stringify(preferences, null, 2)); // Added detailed log
      return res.status(400).json({ error: 'Invalid preferences format. Each preference must have a valid collegeId and a positive integer priority.' });
    }

    // Save preferences
    user.selectedColleges = preferences.map(p => ({ college: p.collegeId, priority: p.priority }));
    await user.save();

    console.log("User preferences updated successfully");
    return res.status(200).json({ message: "Preferences submitted successfully. Thank you!" });
  } catch (error) {
    console.error("Error saving preferences:", error);
    return res.status(500).json({ error: "An error occurred while saving your preferences. Please try again later." });
  }
}));



// Render Allotted Colleges Page
app.get(
  '/alloted-colleges',
  asyncHandler(async (req, res) => {
    const { userId } = req.query;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send('Invalid User ID');
    }

    const user = await LogInCollection.findById(userId).populate('selectedColleges');

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('allotedColleges', { user, allottedColleges: user.selectedColleges });
  })
);

// Success Route
app.get('/success', (req, res) => {
  res.render('success'); // Render success.hbs
});

// Success Route
app.get('/success', (req, res) => {
  res.render('success'); // Render success.hbs
});

// Route to trigger matchmaking and display results
app.get(
  '/matchmaking',
  asyncHandler(async (req, res) => {
    console.log("Attempting to call performMatchmaking..."); // <-- Add this log
    try {
      const results = await performMatchmaking(); // Call the matchmaking function
      res.render('matches', { matches: results }); // Render the results in a template
    } catch (error) {
      console.error('Error during matchmaking route execution:', error); // Changed log prefix
      res.status(500).send('An error occurred during matchmaking.');
    }
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connection established successfully.');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});