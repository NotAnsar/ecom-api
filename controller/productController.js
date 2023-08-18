const AppError = require('../utils/appError');
const { Brand, Product, Category } = require('../model/productModel');

exports.addBrand = async (req, res) => {
	try {
		const { name } = req.body;

		if (!name) throw new AppError('Please provide required inputs', 401);

		const newBrand = await Brand.create({ name });

		res.status(201).json({
			status: 'success',
			message: 'Brand Created',
			data: newBrand,
		});
	} catch (err) {
		console.log(err);
		res.status(404).json({
			status: 'fail',
			message: err.message || 'Brand not Created',
			error: err,
		});
	}
};

exports.getBrand = async (req, res) => {
	try {
		const brands = await Brand.find();

		res.status(201).json({
			status: 'success',
			message: 'here is your brands',
			data: brands,
		});
	} catch (err) {
		console.log(err);
		res.status(404).json({
			status: 'fail',
			message: err.message || 'cannot get Brands',
			error: err,
		});
	}
};

exports.deleteBrand = async (req, res) => {
	try {
		const deletedBrand = await Brand.findByIdAndDelete(req.params.id);

		res.status(201).json({
			status: 'success',
			message: 'brand deleted',
			data: deletedBrand,
		});
	} catch (err) {
		console.log(err);
		res.status(404).json({
			status: 'fail',
			message: err.message || 'cannot delete Brands',
			error: err,
		});
	}
};

exports.addCategory = async (req, res) => {
	try {
		const { name } = req.body;

		const newCategory = await Category.create({ name });

		res.status(201).json({
			status: 'success',
			message: 'Category Created',
			data: newCategory,
		});
	} catch (err) {
		console.log(err);
		res.status(404).json({
			status: 'fail',
			message: err.message || 'Category not Created',
			error: err,
		});
	}
};

exports.getCategory = async (req, res) => {
	try {
		const categories = await Category.find();

		res.status(201).json({
			status: 'success',
			message: 'here is your Categories',
			data: categories,
		});
	} catch (err) {
		console.log(err);
		res.status(404).json({
			status: 'fail',
			message: err.message || 'cannot get Categories',
			error: err,
		});
	}
};

exports.addProduct = async (req, res) => {
	try {
		const { name, price, description, stock, image, category, brand } =
			req.body;

		const newProduct = await Product.create({
			name,
			price,
			description,
			stock,
			image,
			category,
			brand,
		});

		res.status(201).json({
			status: 'success',
			message: 'Product Created',
			data: newProduct,
		});
	} catch (err) {
		console.log(err);
		res.status(404).json({
			status: 'fail',
			message: err.message || 'Product not Created',
			error: err,
		});
	}
};

exports.getProduct = async (req, res) => {
	try {
		// 1. FILTERING
		const queryObj = { ...req.query };
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach((ef) => delete queryObj[ef]);
		let queryStr = JSON.stringify(queryObj);
		// FROM gt|gte|lt|lte TO $gt|$gte|$lt|$lte // to match mongo db querying method
		queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

		let query = Product.find(JSON.parse(queryStr));

		// 2. SORTING
		if (req.query.sort) {
			const sortBy = req.query.sort.split(',').join(' ');
			query = query.sort(sortBy);
		}

		// 	3.LIMITING FIELDS
		if (req.query.fields) {
			const fields = req.query.fields.split(',').join(' ');
			query = query.select(fields);
		} else {
			query = query.select('-__v');
		}

		// 4.PAGINATION

		const page = +req.query.page || 1;
		const limit = +req.query.limit || 100;
		const pagesObj = { currentPage: page, pageSize: limit };
		const skip = (page - 1) * limit;
		query = query.skip(skip).limit(limit);

		if (req.query.page) {
			const numProduct = await Product.countDocuments(JSON.parse(queryStr));
			pagesObj.totalpages = Math.ceil(numProduct / limit);
			pagesObj.totalProducts = numProduct;

			if (skip > numProduct)
				throw new AppError('This page does not exist', 400);
		}

		const [products, brands, categories] = await Promise.all([
			query,
			Brand.find(),
			Category.find(),
		]);

		res.status(201).json({
			status: 'success',
			message: 'here is your Products',
			data: { products, brands, categories },
			page: { ...pagesObj, pageTotal: products.length },
		});
	} catch (error) {
		console.log(error);
		const statusCode = error.status || 500;
		res.status(statusCode).json({
			status: 'fail',
			message: error.message || 'cannot get Products',
			error: error,
		});
	}
};
