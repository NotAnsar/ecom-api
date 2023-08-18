const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const Address = require('./addressModel');

// const addressSchema = new mongoose.Schema({
// 	city: { type: String, required: true },
// 	adress: { type: String, required: true },
// 	country: { type: String, required: true },
// 	zipCode: { type: Number, required: true },
// });

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: [true, 'Please tell us your name!'],
	},
	lastName: {
		type: String,
		required: [true, 'Please tell us your name!'],
	},
	email: {
		type: String,
		required: [true, 'Please provide your email'],
		unique: [true, 'this email already exists , please Login'],
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a valid email'],
	},
	tel: { type: String },
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user',
	},
	password: {
		type: String,
		required: [true, 'Please provide a password'],
		minlength: 8,
		select: false,
	},
	adresse: [Address.schema],
});

// hash password
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	try {
		const hashedPass = await bcrypt.hash(this.password, 12);
		this.password = hashedPass;
		next();
	} catch (error) {
		return next(error);
	}
});

// verify password
userSchema.methods.correctPassword = async function (password, userPassword) {
	const correct = await bcrypt.compare(password, userPassword);

	return correct;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
