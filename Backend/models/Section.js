const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    order: {
        type: Number, // Order to arrange sections in a course
    },
    sessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session' // References the Session model
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

sectionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Section', sectionSchema);
