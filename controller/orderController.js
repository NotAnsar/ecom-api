const AppError = require('../utils/appError');
const Order = require('../model/orderModel');
const catchAsync = require('../utils/catchAsync');

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
