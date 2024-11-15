const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/LoginFormPractice')
  .then(() => {
    console.log('mongoose connected');
  })
  .catch((e) => {
    console.log('failed');
  });

const logInSchema = new mongoose.Schema({
  name: String,
  email: String,
  totalMarks: String,
  passoutYear: String,
  fatherName: String,
  password: String,
});


// Define Subject Schema
const subjectSchema = new mongoose.Schema({
  name: String,
  minMarks: Number,
  maxMarks: Number,
  seats: Number,
  preferences: [String], // Array of student IDs
});

// Define College Schema
const collegeSchema = new mongoose.Schema({
  name: String,
  subjects: [subjectSchema], // List of subjects offered
});

// Create Models
const LogInCollection = mongoose.model('LogInCollection', studentSchema); // Login for students
const College = mongoose.model('College', collegeSchema);

module.exports = {
  LogInCollection,
  College,
};
