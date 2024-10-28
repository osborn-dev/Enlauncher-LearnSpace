// // controllers/InstructorController.js
// const asyncHandler = require('express-async-handler');
// const bcrypt = require('bcryptjs');
// const Instructor = require('../models/Instructor');
// const User = require('../models/userModel')
// const jwt = require('jsonwebtoken');

// // Register a new instructor
// const registerInstructor = asyncHandler(async (req, res) => {
//     const { name, email, username, password, expertise } = req.body;
//     if (!name || !email || !username || !password || !expertise) {
//         res.status(400);
//         throw new Error('Please include all fields');
//     }

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//         res.status(400);
//         throw new Error('User already exists');
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const user = await User.create({
//         name,
//         email,
//         username,
//         password: hashedPassword
//     });

//     // Create Instructor profile linked to the User ID
//     const instructor = new Instructor({
//         userId: user._id,
//         expertise,
//         name,
//         email,
//     });
//     await instructor.save();

//     if (user) {
//         // await sendWelcomeEmail(user.email, user.name);
//         res.status(201).json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             username: user.username,
//             role: 'instructor',
//             token: generateToken(user._id)
//         });
//     } else {
//         res.status(400);
//         throw new Error('Invalid instructor data');
//     }
// });


// // logs in an existing Instructor
// const loginInstructor = asyncHandler(async (req, res) => {
//     const { email, password } = req.body // Destructure login details from request body
//     const instructor = await Instructor.findOne({email}) // Find user by email
//     // Check if user exists and if the password matches
//     if (instructor && (await bcrypt.compare(password, instructor.password))) {
//         res.status(200).json({
//             _id: instructor._id, // Return user details and token
//             name: instructor.name,
//             email: instructor.email,
//             token: generateToken(instructor._id) // Generate JWT token
//         });
//     } else {
//         res.status(401) // Return 401 status for invalid credentials
//         throw new Error('Invalid Credentials') // Throw error for wrong login details
//     }
// })


// // Generate a token for the instructor
// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
// };

// module.exports = { registerInstructor, loginInstructor };
