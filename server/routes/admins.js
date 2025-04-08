const express = require('express')
const router = express.Router()
const { upload } = require('../config/cloudinary.js')
const { getAllUsers } = require('../controllers/admins.js')
const { route } = require('./auth.js')
const { uploadProfilePic, getProfilePic, deleteProfilePic } = require('../controllers/uploadProfilePic.js')
const { adminAuth } = require('../middlewares/auth.js')

router.post('/uploadProfilePic', upload.single('profilePic'), uploadProfilePic)
router.get('/getProfilePic', adminAuth, getProfilePic)
router.get('/deleteProfilePic', adminAuth, deleteProfilePic)
router.route('/profile').get(getAllUsers)

module.exports = router