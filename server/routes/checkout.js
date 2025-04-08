const express = require('express')
const router = express.Router()

const { orderCheckout, verifyPayment } = require('../controllers/checkout')

router.route('/').post(orderCheckout)
router.route('/verify').post(verifyPayment)

module.exports = router