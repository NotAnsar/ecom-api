const express = require('express');
const { protect } = require('../controller/authController');
const {
	addNewOrder,
	getOrders,
	getOrder,
	addNewOrderWithPayment,
} = require('../controller/orderController');

const router = express.Router();

router.post('/', protect, addNewOrder);
router.post('/payment', protect, addNewOrderWithPayment);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);

module.exports = router;
