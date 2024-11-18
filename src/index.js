require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Import routes and models
const LogInCollection = require('./mongo'); // Ensure this path is correct
const addCollegeRoutes = require('./addcollege'); // Adjust path as needed
const matchingRoutes = require('../routes/matching'); // Adjust path as needed

const app = express();
const port = process.env.PORT || 3000; // Default port is 3000, but can be overridden by .env

// Middleware
app.use(express.urlencoded({ extended: true })); // For handling URL-encoded data
app.use(express.json()); // For handling JSON payloads
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files

// Set up Handlebars view engine
app.set('views', path.join(__dirname, '../templates'));
app.set('view engine', 'hbs');

// Register routes
app.use(addCollegeRoutes); // College routes
app.use(matchingRoutes);   // Matching algorithm routes

// Root route ("/")
app.get('/', (req, res) => {
  res.render('login'); // Ensure you have a 'home.hbs' template in the 'templates' folder
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
// Handle /home route
app.get('/home', async (req, res) => {
  const userId = req.query.userId;

  try {
    // Fetch the user from the database
    const user = await LogInCollection.findById(userId);

    // Log the user object to check its properties
    console.log(user);

    if (user) {
      // Render the home page and pass the user object
      res.render('home', { user }); // Passing the entire user object
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected');
    
    // Start the server only after the database is connected
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit process on database connection failure
  });
