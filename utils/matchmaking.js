const LogInCollection = require('../src/mongo');
const College = require('../models/colleges');

async function performMatchmaking() {
  try {
    console.log('Clearing existing matched students from all colleges...');
    // Update all colleges in the database to have an empty matchedStudents array
    await College.updateMany({}, { $set: { matchedStudents: [] } });
    console.log('Existing matched students cleared from database.');

    console.log('Starting Gale-Shapley stable matching...');

    const colleges = await College.find();
    if (!colleges) {
        console.error("Failed to fetch colleges or colleges is null/undefined.");
        throw new Error("Failed to fetch colleges.");
    }
    console.log(`Fetched ${colleges.length} colleges.`);

    const students = await LogInCollection.find();
    if (!students) {
        console.error("Failed to fetch students or students is null/undefined.");
        throw new Error("Failed to fetch students.");
    }
    console.log(`Fetched ${students.length} students.`);

    const collegeMap = {};
    colleges.forEach((college, index) => {
      if (!college || !college._id) {
        console.error(`College at index ${index} is invalid or missing _id:`, college);
        return; // Skip this college if it's invalid
      }
      college.matchedStudents = []; 
      college.capacity = college.capacity || 1; 
      collegeMap[college._id.toString()] = college;
    });
    console.log('College map created with keys:', Object.keys(collegeMap));

    students.sort((a, b) => {
      if (a === null || a === undefined || typeof a.totalMarks !== 'number') {
        console.warn('Student A with missing or invalid totalMarks found during sort:', a);
      }
      if (b === null || b === undefined || typeof b.totalMarks !== 'number') {
        console.warn('Student B with missing or invalid totalMarks found during sort:', b);
      }
      // Provide a default sort order if marks are problematic, to avoid NaN issues with sort
      const marksA = (typeof a.totalMarks === 'number') ? a.totalMarks : -Infinity;
      const marksB = (typeof b.totalMarks === 'number') ? b.totalMarks : -Infinity;
      return marksB - marksA;
    });
    console.log('Students sorted by totalMarks.');

    const unmatchedStudents = [...students];
    let studentProcessingCounter = 0;

    while (unmatchedStudents.length > 0) {
      const student = unmatchedStudents.shift();
      studentProcessingCounter++;
      
      if (!student || !student._id) {
        console.error(`Encountered invalid student object at processing counter ${studentProcessingCounter}:`, student);
        continue;
      }
      console.log(`Processing student ${studentProcessingCounter}/${students.length}: ${student._id}`);

      if (!student.selectedColleges) {
         console.log(`Student ${student._id} has no selectedColleges field.`);
         continue;
      }
      if (!Array.isArray(student.selectedColleges) || student.selectedColleges.length === 0) {
        console.log(`Student ${student._id} has no preferences or selectedColleges is not an array.`);
        continue;
      }

      const sortedPreferences = [...student.selectedColleges].sort((a, b) => {
        const priorityA = (a && typeof a.priority === 'number') ? a.priority : Infinity;
        const priorityB = (b && typeof b.priority === 'number') ? b.priority : Infinity;
        if (priorityA === Infinity) console.warn(`Student ${student._id} has preference with invalid priority A:`, a);
        if (priorityB === Infinity) console.warn(`Student ${student._id} has preference with invalid priority B:`, b);
        return priorityA - priorityB;
      });
      console.log(`Student ${student._id} has ${sortedPreferences.length} sorted preferences.`);

      for (let prefIndex = 0; prefIndex < sortedPreferences.length; prefIndex++) {
        const pref = sortedPreferences[prefIndex];
        console.log(`Student ${student._id}, pref ${prefIndex + 1}:`, JSON.stringify(pref));

        if (!pref) {
          console.error(`Student ${student._id} has an undefined preference object at index ${prefIndex}.`);
          continue;
        }
        if (!pref.college) {
          console.error(`Student ${student._id} preference at index ${prefIndex} is missing 'college' field:`, pref);
          continue;
        }
        
        let collegeIdStr;
        try {
          // Ensure pref.college is not null or undefined before calling toString
          if (pref.college === null || pref.college === undefined) {
            console.error(`Student ${student._id} preference at index ${prefIndex} has null or undefined 'college' field.`);
            continue;
          }
          collegeIdStr = pref.college.toString();
        } catch (e) {
          console.error(`Student ${student._id} preference at index ${prefIndex} has invalid 'college' field that cannot be converted to string:`, pref.college, e);
          continue;
        }

        const college = collegeMap[collegeIdStr];
        if (!college) {
          console.warn(`Student ${student._id} preferred college ${collegeIdStr} (from pref: ${JSON.stringify(pref.college)}) not found in collegeMap.`);
          continue;
        }
        console.log(`Student ${student._id} trying for college ${college.name} (ID: ${college._id})`);

        if (college.matchedStudents.length < college.capacity) {
          console.log(`College ${college.name} has space. Matching student ${student._id} (${student.name}).`);
          // Store student object with id and name
          college.matchedStudents.push({ _id: student._id, name: student.name }); 
          break; 
        } else {
          console.log(`College ${college.name} is full. Student ${student._id} not matched to this college (current logic).`);
        }
      }
    }
    console.log('Finished processing students for matching.');

    console.log('Saving updated colleges...');
    await Promise.all(colleges.map(async (c, index) => {
      try {
        if (!c || !c._id) {
          console.error(`College object at index ${index} for saving is undefined or missing _id.`);
          return;
        }
        console.log(`Saving college ${c.name || `Unnamed College (ID: ${c._id})`} with ${c.matchedStudents.length} matched students.`);
        await c.save();
      } catch (saveError) {
        console.error(`Error saving college ${c && (c.name || c._id)}:`, saveError.message, saveError.stack);
      }
    }));

    console.log('✅ Gale-Shapley stable matching completed.');
    return colleges.map(c => {
      if (!c || !c.name) return { name: "Error: Invalid College Data", matchedStudents: [] };
      return {
        name: c.name,
        // matchedStudents will now be an array of objects like [{ _id: '...', name: '...' }]
        matchedStudents: c.matchedStudents 
      };
    });

  } catch (error) {
    console.error('❌ Error in Gale-Shapley stable matching (outer catch):', error.message, error.stack);
    throw error;
  }
}

module.exports = performMatchmaking;
