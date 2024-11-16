var mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/LoginFormPractice', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Mongoose connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });

// Define Student (Login) Schema
const logInSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  passoutYear: { type: Number, required: true },
  fatherName: { type: String, required: true },
  password: { type: String, required: true },
});

// Define Subject Schema
const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  minMarks: { type: Number, required: true },
  maxMarks: { type: Number, required: true },
  seats: { type: Number, required: true },
  preferences: { type: [String], default: [] }, // Array of student IDs
});

// Define College Schema
const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subjects: { type: [subjectSchema], required: true }, // List of subjects offered
});

// Create Models
const LogInCollection = mongoose.model('LogInCollection', logInSchema); // Login for students
const College = mongoose.model('College', collegeSchema);

// Export Models
module.exports = {
  LogInCollection,
  College,
};
