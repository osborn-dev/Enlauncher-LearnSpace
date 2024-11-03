const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author', // Reference to the Author model
    required: true
  },
  authorName: {
    type: String
  },
  type: {
    type: String,
    enum: ['blog', 'video', 'audio'], // Define possible types of content
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String, // Main content for blogs or text-based posts
    required: function () { return this.type === 'blog'; } // Required for blogs only
  },
  mediaUrl: {
    type: String, // URL for audio or video content
    required: function () { return this.type !== 'blog'; } // Required for audio/video only
  },
  likes:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  shares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reposts:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
    commentText: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

contentSchema.index({ likes: 1 });
contentSchema.index({ shares: 1 });
contentSchema.index({ reposts: 1 });

module.exports = mongoose.model('Content', contentSchema);
