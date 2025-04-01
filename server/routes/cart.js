const express = require('express')
const router = express.Router()

const { getCartItems, addToCart, removeFromCart, changeItemQuantity, clearCart } = require('../controllers/cart')

router.route('/items/:id').get(getCartItems)
router.route('/add').post(addToCart)
router.route('/remove').delete(removeFromCart)
router.route('/quantity').put(changeItemQuantity)
router.route('/clear/:uid').delete(clearCart)

module.exports = router