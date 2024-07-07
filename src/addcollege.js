const mongoose = require('mongoose');
const CollegeCollection = require('./college.js');

mongoose.connect("mongodb://localhost:27017/LoginFormPractice", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Mongoose connected');
    await CollegeCollection.create([
        { name: "Greenwood University", location: "New York", marksRequired: 80 },
        { name: "Harvard College", location: "Massachusetts", marksRequired: 90 },
        { name: "Stanford University", location: "California", marksRequired: 88 },
        { name: "MIT", location: "Massachusetts", marksRequired: 92 },
        { name: "University of Oxford", location: "Oxford", marksRequired: 85 },
        { name: "Cambridge University", location: "Cambridge", marksRequired: 87 },
        { name: "University of Tokyo", location: "Tokyo", marksRequired: 82 },
        { name: "Seoul National University", location: "Seoul", marksRequired: 78 },
        { name: "University of Melbourne", location: "Melbourne", marksRequired: 83 },
        { name: "National University of Singapore", location: "Singapore", marksRequired: 86 },
        { name: "University of Toronto", location: "Toronto", marksRequired: 81 },
        { name: "University of Sydney", location: "Sydney", marksRequired: 79 },
        { name: "University of Hong Kong", location: "Hong Kong", marksRequired: 84 },
        { name: "University of California, Berkeley", location: "California", marksRequired: 89 },
        { name: "University of Edinburgh", location: "Edinburgh", marksRequired: 77 },
        { name: "University of California, Los Angeles", location: "California", marksRequired: 91 },
        { name: "University of Washington", location: "Washington", marksRequired: 74 },
        { name: "University of Pennsylvania", location: "Pennsylvania", marksRequired: 88 },
        { name: "University of Illinois Urbana-Champaign", location: "Illinois", marksRequired: 76 },
        { name: "University of California, San Diego", location: "California", marksRequired: 79 },
        { name: "University of British Columbia", location: "Vancouver", marksRequired: 82 }
    ]);
    console.log('Colleges added');
    mongoose.connection.close();
})
.catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
});
