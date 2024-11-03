const asyncHandler = require('express-async-handler');
const Author = require('../models/Author');
const User = require('../models/userModel');

// Controller for creating a new author
const createAuthor = asyncHandler(async (req, res) => {
  const { name, bio, profilePicture, socialLinks, interests } = req.body;
  const userId = req.user._id; // Get user ID from request (assumed populated by middleware)

  // Ensure that the user exists before creating an author profile
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found. Only registered users can become authors.' });
  }

  // Check if the user is already an author
  const existingAuthor = await Author.findOne({ userId });
  if (existingAuthor) {
    return res.status(400).json({ message: 'User is already an author' });
  }

  // Create a new author document
  const newAuthor = new Author({
    userId: user._id,
    name,
    bio,
    profilePicture,
    socialLinks,
    interests,
    createdAt: Date.now()
  });

  // Save author to database
  await newAuthor.save();
  res.status(201).json({ message: 'Author profile created successfully', author: newAuthor });
});

// Controller for retrieving an author with populated user and content details
const getAuthorWithDetails = asyncHandler(async (req, res) => {
  const { authorId } = req.params;

  // Find author and populate user and content fields
  const author = await Author.findById(authorId)
    .populate({
      path: 'userId',
      select: 'username email' // Fetch only relevant fields from User
    })
    .populate({
      path: 'content',
      select: 'title createdAt' // Fetch only relevant fields from Content
    });

  if (!author) {
    return res.status(404).json({ message: 'Author not found' });
  }

  res.status(200).json(author);
});

module.exports = {
  createAuthor,
  getAuthorWithDetails
};
