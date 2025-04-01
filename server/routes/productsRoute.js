const express = require('express')
const router = express.Router()

const { getProducts, getProductById, getSearchedProducts, filterProductSearch} = require('../controllers/productsControllers')

router.route('/').get(getProducts)
router.route('/:id').get(getProductById)
router.route('/products/search').get(getSearchedProducts)
router.route('/products/filter').get(filterProductSearch)

module.exports = router