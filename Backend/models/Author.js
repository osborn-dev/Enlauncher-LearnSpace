const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User model to ensure only registered users can become authors
    required: true,
    unique: true // Enforces a one-to-one relationship between a User and an Author
  },
  name: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    maxLength: 500
  },
  profilePicture: {
    type: String // URL to the profile picture, optional field
  },
  socialLinks: {
    type: Map,
    of: String // Allows key-value pairs for various social media links, e.g., { twitter: "url", linkedin: "url" }
  },
  interests: [{
    type: String // Array to store topics or tags related to the author's interests
  }],
  content: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content' // References content created by the author, links to the Content model
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Author', authorSchema);
