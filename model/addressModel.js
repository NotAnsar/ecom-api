const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
	city: { type: String, required: true },
	adress: { type: String, required: true },
	country: { type: String, required: true },
	zipCode: { type: Number, required: true },
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
