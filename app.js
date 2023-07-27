const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const authRouter = require('./router/authRouter');
const { default: mongoose } = require('mongoose');

const app = express();

app.use(express.json());

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

// ROUTERS
app.use('/api/v1/auth', authRouter);

// RUNNING THE SERVER
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
