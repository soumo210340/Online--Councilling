const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    marksRequired: {
        type: Number,
        required: true
    }
});

const CollegeCollection = mongoose.model('CollegeCollection', collegeSchema);

module.exports = CollegeCollection;
