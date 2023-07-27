const User = require('../model/userModel');

exports.register = async (req, res) => {
	try {
		const newUser = await User.create(req.body);
		console.log('inserting');
		res
			.status(200)
			.json({ status: 'success', message: 'User Created', data: newUser });
	} catch (err) {
		console.log(err);
		res.status(404).json({
			status: 'fail',
			message: 'User not Created',
		});
	}
};
