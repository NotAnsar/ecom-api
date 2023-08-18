const mongoose = require('mongoose');
const Address = require('./addressModel');

const orderSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},

	products: [
		{
			product: {
				type: mongoose.Schema.ObjectId,
				ref: 'Product',
				required: true,
			},
			quantity: { type: Number, default: 1 },
		},
	],
	adresse: Address.schema,
	status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
	createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
