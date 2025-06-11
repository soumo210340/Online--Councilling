const mongoose = require("mongoose");


const preferenceSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  priority: {
    type: Number,
    required: true
  }
});


// Define the student schema
/*const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  passoutYear: { type: Number, required: true },
  fatherName: { type: String, required: true },
  preferences: [preferenceSchema] // Array of college preferences
});*/
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  passoutYear: { type: Number, required: true },
  fatherName: { type: String, required: true },
  preferences: [preferenceSchema]
}, { timestamps: true });


const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
