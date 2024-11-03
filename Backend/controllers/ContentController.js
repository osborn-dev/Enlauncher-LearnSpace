const asyncHandler = require('express-async-handler'); 
const Content = require('../models/Content'); 
const Author = require('../models/Author'); 

// Controller to create new content
const createContent = asyncHandler(async (req, res) => {
  const { type, title, body, mediaUrl } = req.body; 
  const authorId = req.authorId; // Get author ID from request (assumed populated by middleware)

  // Check if the author exists
  const author = await Author.findById(authorId);
  if (!author) {
    return res.status(404).json({ message: 'Author not found' }); 
  }

  // Create new content based on the provided data
  const newContent = new Content({
    type,
    title,
    body,
    mediaUrl,
    authorName: author.name,
    authorId: author._id, // Set authorId for content
  });

  // Save the content to the database
  await newContent.save();
  res.status(201).json({ message: 'Content created successfully', content: newContent }); // Send success response
});

// Controller to retrieve content with author and comments populated
const getContentWithDetails = asyncHandler(async (req, res) => {
  const { contentId } = req.params; // Get contentId from URL parameters

  // Finding the content by ID, populating author and comments fields
  const content = await Content.findById(contentId)
    .populate({
      path: 'authorId',
      select: 'name bio profilePicture', // Selecting only necessary author fields
    })
    .populate({
      path: 'comments.userId',
      select: 'username email', // Selecting relevant user details for comments
    });

  if (!content) {
    return res.status(404).json({ message: 'Content not found' }); 
  }

  res.status(200).json(content); // Send content with populated details
});

// Controller to update likes, shares, or reposts
const updateEngagement = asyncHandler(async (req, res) => {
  const { contentId } = req.params; // Getting contentId from URL parameters
  const { action } = req.body; // Getting action (like, share, repost) from request body
  const userId = req.user._id; // getting userId from the authenticated user

  console.log('Action received:', action); // Log action for debugging
  console.log('User ID:', userId); // Log userId for debugging

  // Determine the field to update based on the action
  let updateField;
  if (action === 'like') updateField = { $addToSet: { likes: userId } };
  else if (action === 'share') updateField = { $addToSet: { shares: userId } };
  else if (action === 'repost') updateField = { $addToSet: { reposts: userId } };
  else return res.status(400).json({ message: 'Invalid action' }); 

  // Update content engagement and return updated document
  const updatedContent = await Content.findByIdAndUpdate(contentId, updateField, { new: true });
  if (!updatedContent) {
    return res.status(404).json({ message: 'Content not found' }); 
  }

  res.status(200).json({ message: 'Content engagement updated', content: updatedContent }); 
});

// Controller to add a comment to content
const addComment = asyncHandler(async (req, res) => {
  const { contentId } = req.params; // Get contentId from URL parameters
  const { commentText } = req.body; // Get comment text from request body
  const userId = req.user._id; // Get userId from the authenticated user

  const content = await Content.findById(contentId); 
  if (!content) {
    return res.status(404).json({ message: 'Content not found' }); 
  }

  // Adding the comment to content's comments array
  content.comments.push({ userId, commentText, createdAt: Date.now() });
  await content.save(); // Save updated content to the database

  res.status(200).json({ message: 'Comment added successfully', content }); 
});

module.exports = {
  createContent,
  getContentWithDetails,
  updateEngagement,
  addComment,
};
