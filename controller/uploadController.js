const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'images/');
	},
	filename: function (req, file, cb) {
		const uniqueFilename =
			file.fieldname + '_' + Date.now() + path.extname(file.originalname);
		cb(null, uniqueFilename);
	},
});

exports.upload = multer({ storage: storage });

exports.uploadFile = (req, res) => {
	const file = req.file;

	return res.status(200).json({
		status: 'success',
		message: 'File Uploaded',
		filename: file.filename,
	});
};
