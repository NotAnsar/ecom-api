const express = require('express');
const { protect, adminOnly } = require('../controller/authController');
const {
	addNewOrder,
	getOrders,
	getOrder,
	addNewOrderWithPayment,
	getAllOrders,
} = require('../controller/orderController');

const router = express.Router();

router.post('/', protect, addNewOrder);
router.post('/payment', protect, addNewOrderWithPayment);
router.get('/', protect, getOrders);
router.get('/all', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrder);

module.exports = router;
