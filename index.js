const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const AppError = require('./utils/appError');
const path = require('path');

dotenv.config();

const corsOptions = {
	origin: process.env.CLIENT_URL.split(','),
	credentials: true,
	methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
	allowedHeaders: 'Authorization,Content-Type',
};

const app = express();

app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/', (req, res) => {
	res.json('hello');
});

app.use(express.json());
app.use(cors(corsOptions));

// CONNECTING TO DB
mongoose
	.connect(
		`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@clusterelectro.cnlj70e.mongodb.net/?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => console.log('DB connection successful!'))
	.catch((err) => console.log(err));

const authRouter = require('./router/authRouter');
const productRouter = require('./router/productRouter');
const orderRouter = require('./router/orderRouter');
const userRouter = require('./router/userRouter');
const uploadRouter = require('./router/uploadRouter');

// ROUTERS
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/upload', uploadRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Register the error-handling middleware after your other routes and middlewares
const errorHandler = (err, req, res, next) => {
	const statusCode = err.status || 500;
	const message = err.message || 'Something went wrong.';

	res.status(statusCode).json({
		status: 'fail',
		message: message,
		error: err,
	});
};
app.use(errorHandler);

// RUNNING THE SERVER

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
