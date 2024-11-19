const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
 name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  preferences: [
    {
      collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        required: true,
      },
      subject: {
        type: String,
        required: true,
      }
    }
  ]
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
