const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        default: Date.now, // Can be used for scheduling live sessions
    },
    duration: {
        type: Number, // Duration in minutes
    },
    resources: [{
        type: String, // URLs to additional resources or downloadable files
    }],
    isFreePreview: {
        type: Boolean,
        default: false, // Allows a few sessions to be marked as free previews
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to update `updatedAt` timestamp
sessionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
