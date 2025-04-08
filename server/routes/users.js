const express = require('express')
const router = express.Router()
const { getUserProfile, getUserAddress, deleteUserAcc } = require('../controllers/users')

router.route('/profile').get(getUserProfile)
router.route('/address').get(getUserAddress)
router.route('/deleteAcc').post(deleteUserAcc)

module.exports = router