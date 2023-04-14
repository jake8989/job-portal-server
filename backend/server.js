const colors = require('colors');
const express = require('express');
const dotenv = require('dotenv').config();
const asyncHandler = require('express-async-handler');
const connectDb = require('./config/db');
const { errorHandeler } = require('./middlewares/errorhandeler');
const app = express();
const port = process.env.PORT || 8080;
connectDb();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/jobs', require('./routes/jobsRoute'));
app.use(errorHandeler);
app.listen(port, () => {
	console.log(`server runnig at port ${port}`.bgYellow);
});
console.log('hii world'.bold);
