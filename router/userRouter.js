const express = require('express');
const {
	addAddress,
	deleteAddress,
	getAddresses,
	getUser,
	updateUser,
	deleteUser,
	updateAddress,
	getUsers,
} = require('../controller/userController');
const { protect, adminOnly } = require('../controller/authController');

const router = express.Router();

router.get('/address', protect, getAddresses);
router.post('/address', protect, addAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.patch('/address/:addressId', protect, updateAddress);
router.get('/', protect, adminOnly, getUsers);
router.get('/me', protect, getUser);
router.patch('/', protect, updateUser);
router.delete('/', protect, deleteUser);

module.exports = router;
