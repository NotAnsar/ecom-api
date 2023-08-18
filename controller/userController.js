const User = require('../model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.addAddress = catchAsync(async (req, res) => {
	const user = req.user;

	const { city, adress, country, zipCode } = req.body;

	user.adresse.push({ city, adress, country, zipCode });
	await user.save();

	res.status(201).json({
		status: 'success',
		message: 'Address added successfully',
		data: user,
	});
});

exports.updateAddress = catchAsync(async (req, res) => {
	const user = req.user;
	const addressId = req.params.addressId;
	const { city, adress, country, zipCode } = req.body;

	const addressIndex = user.adresse.findIndex(
		(address) => address.id === addressId
	);

	if (addressIndex === -1) {
		throw new AppError('Address not found', 401);
	}

	// Update address fields using destructuring
	user.adresse[addressIndex] = {
		...user.adresse[addressIndex],
		city,
		adress,
		country,
		zipCode,
	};

	await user.save();

	res.status(201).json({
		status: 'success',
		message: 'Address updated successfully',
		data: user,
	});
});

exports.deleteAddress = catchAsync(async (req, res) => {
	const user = req.user;
	const addressId = req.params.addressId;

	const addressIndex = user.adresse.findIndex(
		(address) => address.id === addressId
	);

	if (addressIndex === -1) {
		throw new AppError('Address not found', 401);
	}

	user.adresse.splice(addressIndex, 1);
	await user.save();

	res.status(201).json({
		status: 'success',
		message: 'Address deleted successfully',
		data: user,
	});
});

exports.getAddresses = catchAsync(async (req, res) => {
	const user = req.user;

	res.status(201).json({
		status: 'success',
		message: 'Addresses retrieved successfully',
		data: user.adresse,
	});
});

exports.getUser = catchAsync(async (req, res) => {
	const user = req.user;

	res.status(201).json({
		status: 'success',
		message: 'User retrieved successfully',
		data: user,
	});
});

exports.updateUser = catchAsync(async (req, res) => {
	const userId = req.user.id;

	let updateData = req.body;

	// If updating the password, hash the new password
	if (updateData.password) {
		const hashedPass = await bcrypt.hash(updateData.password, 12);
		updateData.password = hashedPass;
	}

	const user = await User.findByIdAndUpdate(userId, req.body, {
		new: true,
		runValidators: true,
	});

	if (!user) {
		throw new AppError('User not found', 401);
	}

	res.status(201).json({
		status: 'success',
		message: 'User updated successfully',
		data: user,
	});
});

exports.deleteUser = catchAsync(async (req, res) => {
	const userId = req.user.id;

	const user = await User.findByIdAndDelete(userId);

	if (!user) {
		throw new AppError('User not found', 401);
	}

	res.status(201).json({
		status: 'success',
		message: 'User deleted successfully',
	});
});
