const express = require('express');
const {
	getBrand,
	addBrand,
	getCategory,
	addCategory,
	getProduct,
	addProduct,
} = require('../controller/productController');
const { protect } = require('../controller/authController');

const router = express.Router();

router.get('/brand', getBrand);
router.post('/brand', addBrand);
router.get('/categories', getCategory);
router.post('/categories', addCategory);
router.get('/', /* protect, */ getProduct);
router.post('/', addProduct);

module.exports = router;
