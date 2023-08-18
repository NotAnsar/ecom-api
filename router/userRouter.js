const express = require('express');
const {
	addAddress,
	deleteAddress,
	getAddresses,
	getUser,
	updateUser,
	deleteUser,
	updateAddress,
} = require('../controller/userController');
const { protect } = require('../controller/authController');

const router = express.Router();

router.get('/address', protect, getAddresses);
router.post('/address', protect, addAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.patch('/address/:addressId', protect, updateAddress);
router.get('/', protect, getUser);
router.patch('/', protect, updateUser);
router.delete('/', protect, deleteUser);

module.exports = router;
