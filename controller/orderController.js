const AppError = require('../utils/appError');
const Order = require('../model/orderModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const catchAsync = require('../utils/catchAsync');
const { Product } = require('../model/productModel');
const calculateOrderTotal = require('../utils/calculateOrderTotal');

exports.addNewOrder = catchAsync(async (req, res) => {
	const { products, adresse } = req.body;

	const user = req.user;

	const newOrder = await Order.create({ products, user, adresse });

	res.status(201).json({
		status: 'success',
		message: 'New Order Created',
		data: newOrder,
	});
});

exports.addNewOrderWithPayment = catchAsync(async (req, res) => {
	const { products } = req.body;

	const orderTotal = await calculateOrderTotal(products);

	if (orderTotal < 0) {
		throw new AppError(
			'Error fetching product prices or quantity is less than minimum allowed value (1)',
			403
		);
	}

	// Create a Payment Intent to authorize the payment
	const paymentIntent = await stripe.paymentIntents.create({
		amount: Math.round(orderTotal * 100), // in cents
		currency: 'usd',
		payment_method_types: ['card'],
	});

	res.status(201).json({
		status: 'success',
		message: 'Here is your Client Secret',
		data: products,
		client_secret: paymentIntent.client_secret,
	});
});

exports.getOrders = catchAsync(async (req, res) => {
	const user = req.user.id;

	let query = Order.find({ user }).populate('products.product');
	const page = +req.query.page || 1;
	const limit = +req.query.limit || 100;
	const pagesObj = { currentPage: page, pageSize: limit };
	const skip = (page - 1) * limit;
	query = query.skip(skip).limit(limit).sort('-createdAt');

	if (req.query.page) {
		const numProduct = await Order.countDocuments({ user });
		pagesObj.totalpages = Math.ceil(numProduct / limit);
		pagesObj.totalProducts = numProduct;

		if (skip > numProduct) throw new AppError('This page does not exist', 400);
	}

	const myOrders = await query;

	res.status(201).json({
		status: 'success',
		message: 'Here Is Your Orders',
		data: myOrders,
		page: { ...pagesObj, pageTotal: myOrders.length },
	});
});

exports.getOrder = catchAsync(async (req, res) => {
	const user = req.user.id;
	const id = req.params.id;

	const myOrder = await Order.findById(id).populate('products.product');

	if (user !== myOrder.user.toString()) {
		throw new AppError('User ID does not match the order owner.', 403);
	}

	res.status(201).json({
		status: 'success',
		message: 'Here Is Your Orders',
		data: myOrder,
	});
});

exports.getAllOrders = catchAsync(async (req, res) => {
	let query = Order.find().populate('products.product');
	const page = +req.query.page || 1;
	const limit = +req.query.limit || 100;
	const pagesObj = { currentPage: page, pageSize: limit };
	const skip = (page - 1) * limit;
	query = query.skip(skip).limit(limit).sort('-createdAt');

	if (req.query.page) {
		const numProduct = await Order.countDocuments({ user });
		pagesObj.totalpages = Math.ceil(numProduct / limit);
		pagesObj.totalProducts = numProduct;

		if (skip > numProduct) throw new AppError('This page does not exist', 400);
	}

	const myOrders = await query;

	res.status(201).json({
		status: 'success',
		message: 'Here Is Your Orders',
		data: myOrders,
		page: { ...pagesObj, pageTotal: myOrders.length },
	});
});
