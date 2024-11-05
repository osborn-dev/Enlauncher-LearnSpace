const mongoose = require('mongoose')
// interest field to be added for user interest to be displayed upon login

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    interestedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    interestedContent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
    username: {
      type: String,
      // Custom validation: required if googleId is not present
      validate: {
        validator: function (v) {
          return this.googleId || v;
        },
        message: 'Please add a username',
      },
    },
    password: {
      type: String,
      // Custom validation: required if googleId is not present
      validate: {
        validator: function (v) {
          return this.googleId || v;
        },
        message: 'Please add a password',
      },
    },
    resetPasswordToken: {type: String},
    resetPasswordExpire: {type: Date},
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    googleId: {
      type: String,
      // Only required for Google OAuth users
      required: false,
      unique: true, // Ensures that Google ID is unique
    },
    profileImage: {
      type: String,
      // Store Google profile image URL for users who sign up with Google
      default: ''
    },
    provider: {
      type: String,
      // Specifies the sign-up method (e.g., 'email' or 'google')
      enum: ['email', 'google'],
      default: 'email'
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)