const express = require('express')
const router = express.Router()

const { orderStatus, updateStatus, getAllOrders } = require('../controllers/adminOrdersControllers')

router.route('/status').put(orderStatus)
router.route('/payment').put(updateStatus)
router.route('/allorders/:adminId').get(getAllOrders)

module.exports = router