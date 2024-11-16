const Student = require('../models/students');
const College = require('../models/colleges');

async function galeShapleyMatching() {
  // Fetch all students and colleges
  const students = await Student.find().populate('preferences.collegeId');
  const colleges = await College.find();

  // Convert colleges to a map for easier access
  const collegeMap = {};
  colleges.forEach(college => {
    collegeMap[college._id] = college;
  });

  // Initialize student and college matches
  const matches = [];
  const studentAssigned = {};  // Track if a student has been assigned a college-subject pair

  students.forEach(student => {
    for (const pref of student.preferences) {
      const college = collegeMap[pref.collegeId];
      const subject = college.subjects.find(s => s.name === pref.subject);

      if (subject && !studentAssigned[student._id]) {
        if (
          subject.minScore <= student.score &&
          student.score <= subject.maxScore &&
          subject.seats > 0
        ) {
          // Allocate the student to the college's subject
          subject.rankedStudents.push({
            studentId: student._id,
            score: student.score,
          });
          subject.seats -= 1;
          studentAssigned[student._id] = true;
          matches.push({
            student: student.name,
            college: college.name,
            subject: subject.name,
          });
          break; // Move to the next student after finding a match
        }
      }
    }
  });

  // Update college documents with the new rankings
  for (const college of colleges) {
    await college.save();
  }

  return matches;
}

module.exports = galeShapleyMatching;
