const express = require('express')
const router = express.Router()
const { forgotPassword, resetPassword} = require('../controllers/ResetController')

router.post('/forgot-password', forgotPassword);

// Reset password route
router.put('/reset-password/:token', resetPassword);

module.exports = router