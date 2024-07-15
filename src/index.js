const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const LogInCollection = require('./mongo');
const addCollegeRoutes = require('./addcollege');
const College = require('../models/college');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Set up handlebars
app.set('views', path.join(__dirname, '../templates'));
app.set('view engine', 'hbs');

// Routes
app.use(addCollegeRoutes);

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { name, password } = req.body;
  const user = await LogInCollection.findOne({ name, password });

  if (user) {
    res.redirect(`/home?userId=${user._id}`);
  } else {
    res.send('Login failed. Please check your credentials.');
  }
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  const { name, email, totalMarks, passoutYear, fatherName, password } = req.body;

  const newUser = new LogInCollection({
    name,
    email,
    totalMarks,
    passoutYear,
    fatherName,
    password,
  });

  await newUser.save();
  res.redirect(`/home?userId=${newUser._id}`);
});
app.get('/home', async (req, res) => {
  const userId = req.query.userId;
  const user = await LogInCollection.findById(userId);

  if (user) {
    // Fetch colleges where the user's totalMarks are within the min and max marks rang
    const colleges = await College.find({
      minMarks: { $lte: user.totalMarks },
      maxMarks: { $gte: user.totalMarks },
    });

    // Render the home page with user data and filtered colleges
    res.render('home', {
      name: user.name,
      email: user.email,
      totalMarks: user.totalMarks,
      passoutYear: user.passoutYear,
      fatherName: user.fatherName,
      colleges, // Pass the filtered colleges to the template
    });
  } else {
    res.send('User not found.');
  }
});
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
