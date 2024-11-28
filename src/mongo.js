const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  totalMarks: { type: Number, required: false }, // Example field for sorting
  selectedColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }], // Array of college references
});

module.exports = mongoose.model('LogInCollection', loginSchema);
