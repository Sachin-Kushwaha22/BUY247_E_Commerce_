const { Router } = require('express')
const router = Router()
const rateLimit = require("express-rate-limit");

const otpLimiter = rateLimit({
    windowMs: 60 * 5000, // 5 minute
    max: 1, // Allow only 1 request per minute per IP
    message: "Too many OTP requests, please try again later.",
    headers: true, // Send rate limit headers
});


const { registerUser, loginUser, logoutUser, checkExisting, checkSignupExisting, generateResendOTP } = require('../controllers/auth');
const { adminLogin, checkAdminAuth, logoutAdmin } = require('../controllers/admins');
const { adminAuth } = require('../middlewares/auth');

router.route('/signup').post(registerUser)
router.route('/signin').post(loginUser)
router.route('/logout').post(logoutUser)
router.route('/doExist').post(checkExisting)
router.route('/signup/doExist').post(checkSignupExisting)
router.post('/generateOTP', otpLimiter, generateResendOTP)

router.get('/checkAdminAuth', checkAdminAuth)
router.route('/admin').post(adminLogin)
router.get('/adminLogout', adminAuth, logoutAdmin)
module.exports = router