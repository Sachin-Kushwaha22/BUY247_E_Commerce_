const express = require('express')
const router = express.Router()

const { setAddress, setShippingAddress, getAddress, setShippingAddressForOrder } = require('../controllers/address')

router.route('/set').post(setAddress)
router.route('/setShippingAddress').post(setShippingAddress)
router.route('/get').get(getAddress)
router.route('/setShippingAddressForOrder').post(setShippingAddressForOrder)

module.exports = router