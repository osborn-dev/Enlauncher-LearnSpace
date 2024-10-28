const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId, // Reference to Course
        ref: 'Course',
    }],
    expertise: [{
        type: String, // Areas of expertise
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

const Instructor = mongoose.model('Instructor', instructorSchema);
module.exports = Instructor;
