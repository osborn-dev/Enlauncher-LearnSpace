const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Course = require('../models/Course');
const Content = require('../models/Content');

// Controller to add course interest
const addCourseInterest = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  // Verifying course exists
  const courseExists = await Course.exists({ _id: courseId });
  if (!courseExists) {
    return res.status(404).json({ message: 'Course not found' });
  }

  // Updating user's interestedCourses
  const user = await User.findByIdAndUpdate(
      userId,
    { $addToSet: { interestedCourses: courseId } },
    { new: true }
  ).populate('interestedCourses', 'name description'); // Populate with course details if needed

  res.status(200).json({ message: 'Course interest added successfully', interests: user.interestedCourses });
});

// Controller to add content interest
const addContentInterest = asyncHandler(async (req, res) => {
  const { contentId } = req.params;
  const userId = req.user._id;

  // Verifying content exists
  const contentExists = await Content.exists({ _id: contentId });
  if (!contentExists) {
    return res.status(404).json({ message: 'Content not found' });
  }

  // Updating user's interestedContent
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { interestedContent: contentId } },
    { new: true }
  ).populate('interestedContent', 'title type'); // Populate with content details if needed

  res.status(200).json({ message: 'Content interest added successfully', interests: user.interestedContent });
});

// Controller to remove course interest
const removeCourseInterest = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { interestedCourses: courseId } },
    { new: true }
  );

  res.status(200).json({ message: 'Course interest removed successfully', interests: user.interestedCourses });
});

// Controller to remove content interest
const removeContentInterest = asyncHandler(async (req, res) => {
  const { contentId } = req.params;
  const userId = req.user._id;

  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { interestedContent: contentId } },
    { new: true }
  );

  res.status(200).json({ message: 'Content interest removed successfully', interests: user.interestedContent });
});

// Controller to get all user interests
const getUserInterests = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId)
    .populate('interestedCourses', 'name description')
    .populate('interestedContent', 'title type');

  res.status(200).json({ interestedCourses: user.interestedCourses, interestedContent: user.interestedContent });
});

module.exports = {
  addCourseInterest,
  addContentInterest,
  removeCourseInterest,
  removeContentInterest,
  getUserInterests,
};
