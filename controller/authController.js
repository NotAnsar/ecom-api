const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

exports.register = async (req, res) => {
	try {
		const { firstName, lastName, email, password, adresse, tel } = req.body;
		const user = await User.findOne({ email });
		if (user) {
			console.log(user);
			throw new AppError('User Already Exists', 401);
		}

		const newUser = await User.create({
			firstName,
			lastName,
			email,
			password,
			adresse,
			tel: tel || '',
		});

		newUser.password = undefined;

		const token = signToken(newUser._id);

		res.status(201).json({
			status: 'success',
			message: 'User Created',
			token,
			data: newUser,
		});
	} catch (err) {
		console.log(err);
		res.status(404).json({
			status: 'fail',
			message: err.message || 'User not Created',
			error: err,
		});
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!(email && password))
			throw new AppError('Please provide email and password!', 401);

		const user = await User.findOne({ email }).select('+password');

		if (!user) throw new AppError('This Email Does not exists', 401);

		const correct = await user.correctPassword(password, user.password);

		user.password = undefined;

		if (!correct) throw new AppError('Incorrect Email or Password', 401);

		const token = signToken(user._id);

		res.status(200).json({
			status: 'success',
			message: 'User has been Logged In',
			token,
			data: user,
		});
	} catch (error) {
		console.log(error);
		res.status(error.status || 500).json({
			status: 'error',
			message: error.message || error,
		});
	}
};

exports.protect = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(' ')[1];

	if (!token)
		return next(
			new AppError('Unauthorized or not logged in please log in', 401)
		);

	try {
		const verifyAsync = promisify(jwt.verify);
		const decoded = await verifyAsync(token, process.env.JWT_SECRET);

		const user = await User.findById(decoded.id);

		if (!user)
			return next(
				new AppError(
					'The user belonging to this token does no longer exist.',
					401
				)
			);

		req.user = user;
		next();
	} catch (error) {
		if (error.name === 'JsonWebTokenError') {
			return next(new AppError('Token is not valid.', 403));
		}
		return next(error);
	}
};

exports.adminOnly = async (req, res, next) => {
	if (req.user.role !== 'admin') {
		return next(
			new AppError('You do not have permission to perform this action', 403)
		);
	}

	next();
};
exports.usersOnly = async (req, res, next) => {
	if (req.user.role !== 'user') {
		return next(
			new AppError('You do not have permission to perform this action', 403)
		);
	}

	next();
};
