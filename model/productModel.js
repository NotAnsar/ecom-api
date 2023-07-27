const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please tell us your name!'],
	},
	price: {
		type: Number,
		required: [true, 'Please tell us your name!'],
	},
	description: {
		type: String,
		trim: true,
		required: [true, 'Please Write a description!'],
	},
	stock: {
		type: Number,
		required: [true, 'Please provide a stock!'],
	},

	image: {
		type: [Number],
		required: [true, 'Please provide an image!'],
	},
	categorie: {
		type: mongoose.Schema.ObjectId,
		ref: 'Categorie',
	},
	brand: {
		type: mongoose.Schema.ObjectId,
		ref: 'Brand',
	},
});

const brandSchema = new mongoose.Schema({
	name: { type: String, required: true },
});
const categorySchema = new mongoose.Schema({
	name: { type: String, required: true },
});

const Category = mongoose.model('Category', categorySchema);
const Brand = mongoose.model('Brand', brandSchema);
const Product = mongoose.model('User', productSchema);

module.exports = { Product, Category, Brand };
