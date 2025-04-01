const express = require('express')
const router = express.Router()

const { getProducts, addProducts, bulkAddProducts, updateProducts, deleteProducts, toggleProductStatus } = require('../controllers/adminProductsControllers')

router.route('/').get(getProducts)
router.route('/add').post(addProducts)
router.route('/bulk-add').post(bulkAddProducts);
router.route('/update/:id').put(updateProducts)
router.route('/delete/:id').delete(deleteProducts)
router.route('/toggle-status/:id').patch(toggleProductStatus);


module.exports = router