const mongoose = require('mongoose');

const logInSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    passoutYear: {
        type: Number,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    }
});

const LogInCollection = mongoose.model('LogInCollection', logInSchema);

module.exports = LogInCollection;
