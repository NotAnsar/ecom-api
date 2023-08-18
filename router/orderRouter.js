const express = require('express');
const { protect } = require('../controller/authController');
const {
	addNewOrder,
	getOrders,
	getOrder,
} = require('../controller/orderController');

const router = express.Router();

router.post('/', protect, addNewOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);

module.exports = router;
