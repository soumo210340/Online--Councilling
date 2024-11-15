const Student = require('../models/student');
const College = require('../models/college');

async function galeShapleyMatch() {
  const students = await Student.find();
  const colleges = await College.find();

  const studentProposals = {}; // Track proposals made by students
  const collegeMatches = {};  // Track matches for colleges

  // Initialize structures
  students.forEach(student => {
    studentProposals[student._id] = [];
  });
  colleges.forEach(college => {
    college.subjects.forEach(subject => {
      collegeMatches[`${college._id}:${subject.name}`] = [];
    });
  });

  let unmatchedStudents = students.map(student => student._id);

  // Main algorithm
  while (unmatchedStudents.length > 0) {
    const studentId = unmatchedStudents.shift();
    const student = await Student.findById(studentId);
    const nextPreference = student.preferences.find(
      pref => !studentProposals[studentId].includes(pref)
    );

    if (!nextPreference) continue; // No more preferences, skip

    studentProposals[studentId].push(nextPreference);

    const [collegeId, subjectName] = nextPreference.split(':');
    const college = await College.findById(collegeId);
    const subject = college.subjects.find(sub => sub.name === subjectName);

    if (
      subject.minMarks <= student.score &&
      subject.maxMarks >= student.score
    ) {
      const currentMatches = collegeMatches[nextPreference];
      if (currentMatches.length < subject.seats) {
        // Accept the student
        collegeMatches[nextPreference].push(studentId);
      } else {
        // Find least preferred current match
        const allMatches = [...currentMatches, studentId];
        allMatches.sort(
          (a, b) => subject.preferences.indexOf(a) - subject.preferences.indexOf(b)
        );
        if (allMatches[allMatches.length - 1] !== studentId) {
          unmatchedStudents.push(studentId); // Student rejected
        }
        collegeMatches[nextPreference] = allMatches.slice(0, subject.seats);
      }
    } else {
      unmatchedStudents.push(studentId); // Student rejected due to criteria
    }
  }

  return collegeMatches;
}

module.exports = galeShapleyMatch;
