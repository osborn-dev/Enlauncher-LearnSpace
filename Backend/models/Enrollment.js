const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Reference to Course model
        required: true,
    },
    enrollmentDate: {
        type: Date,
        default: Date.now, // Automatically set the enrollment date
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    startDate: {
        type: Date,
    },
    completionStatus: {
        type: String,
        enum: ['not started', 'in progress', 'completed'],
        default: 'not started',
    },
    progress: {
        type: Number,
        default: 0, // Represents percentage completed
    }
});

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment;
