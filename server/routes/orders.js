const express = require('express')
const router = express.Router()

const { updateStatus, orderItem, getAllOrders, getOrderById, getOrderItems, changeItemQuantity, removeOrderItem } = require('../controllers/orders')

router.route('/itemslist/:uid').get(getAllOrders)
router.route('/product').post(orderItem)
router.route('/paymentstatus').put(updateStatus)
router.route('/:o_id').get(getOrderById)

router.route('/orderItems/:oid').get(getOrderItems)
router.route('/orderItems/quantity').put(changeItemQuantity)
router.route('/orderItems/remove/:id').delete(removeOrderItem)

module.exports = router