const express = require('express');
const { register, login } = require('../controller/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
// router.post('/resetPassword', resetPassword);
// router.post('/logout', logout);
// router.post('/changePassword', verify, changePassword);

module.exports = router;
