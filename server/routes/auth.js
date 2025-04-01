const { Router } = require('express')
const router = Router()
const rateLimit = require("express-rate-limit");

const otpLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 1, // Allow only 1 request per minute per IP
    message: "Too many OTP requests, please try again later.",
    headers: true, // Send rate limit headers
});


const { registerUser, loginUser, checkExisting, generateOTP } = require('../controllers/auth')

router.route('/signup').post(registerUser)
router.route('/signin').post(loginUser)
router.route('/doExist').get(checkExisting)
router.post('/generateOTP', otpLimiter, generateOTP)
module.exports = router