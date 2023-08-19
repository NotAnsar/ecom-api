const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const AppError = require('./utils/appError');
dotenv.config();

// const corsOptions = {
// 	origin: process.env.CLIENT_URL,
// 	credentials: true,
// 	methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
// };
// const corsOptions = { origin: '*' };

const app = express();
app.get('/', (req, res) => {
	res.json('hello');
});

app.use(express.json());
// app.use(cors(corsOptions));

app.use((req, res, next) => {
	//allow access from every, elminate CORS
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.removeHeader('x-powered-by');
	//set the allowed HTTP methods to be requested
	res.setHeader('Access-Control-Allow-Methods', 'POST');
	//headers clients can use in their requests
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	//allow request to continue and be handled by routes
	next();
});

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

// ROUTERS
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/users', userRouter);

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
