const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please tell us your name!'],
	},
	price: {
		type: Number,
		required: [true, 'Please give us The price!'],
		min: 1,
	},
	description: {
		type: String,
		trim: true,
		required: [true, 'Please Write a description!'],
	},

	image: {
		type: String,
		// required: [true, 'Please provide an image!'],
	},
	category: {
		type: mongoose.Schema.ObjectId,
		ref: 'Category',
		required: [true, 'Please provide a category id!'],
	},
	brand: {
		type: mongoose.Schema.ObjectId,
		ref: 'Brand',
		required: [true, 'Please provide a brand id!'],
	},
});

const brandSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: [true, 'this brand already exists'],
	},
});
const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: [true, 'this category already exists'],
	},
});

const Category = mongoose.model('Category', categorySchema);
const Brand = mongoose.model('Brand', brandSchema);

productSchema.pre(/^find/, async function (next) {
	this.populate('brand').populate('category');
	next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = { Product, Category, Brand };
