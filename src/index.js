const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const LogInCollection = require('./mongo');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Set up handlebars
app.set('views', path.join(__dirname, '../tempelates'));
app.set('view engine', 'hbs');

// Routes
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
    res.render('home', {
      name: user.name,
      email: user.email,
      totalMarks: user.totalMarks,
      passoutYear: user.passoutYear,
      fatherName: user.fatherName,
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
