const express = require('express');
const {
	getBrand,
	addBrand,
	getCategory,
	addCategory,
	getProduct,
	addProduct,
	getProducts,
	deleteProduct,
} = require('../controller/productController');
const { protect, adminOnly } = require('../controller/authController');

const router = express.Router();

router.get('/brand', getBrand);
router.post('/brand', addBrand);
router.get('/categories', getCategory);
router.post('/categories', addCategory);
// upload new image

// add new product
// check if product associated with orders
// update product

router.get('/', /* protect, */ getProducts);
router.get('/:id', /* protect, */ getProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/', protect, adminOnly, addProduct);

module.exports = router;
