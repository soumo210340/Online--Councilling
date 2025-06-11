// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  selectedColleges: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'College' }  // This references the College model
  ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
