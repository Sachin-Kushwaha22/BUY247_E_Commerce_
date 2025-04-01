const express = require('express')
const router = express.Router()

const { updateStatus, orderItem, getAllOrders, getOrderById } = require('../controllers/orders')

router.route('/itemslist/:uid').get(getAllOrders)
router.route('/product').post(orderItem)
router.route('/paymentstatus').put(updateStatus)
router.route('/:o_id').get(getOrderById)

module.exports = router