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

const LogInCollection = mongoose.model('LogInCollection', logInSchema);

module.exports = LogInCollection;
