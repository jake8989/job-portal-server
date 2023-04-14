const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const user = require('../models/userModel');
const dotenv = require('dotenv').config();
const protect = asyncHandler(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1];
			const decode = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await user.findById(decode.userId).select('-password');
			// console.log(req.user);
			next();
		} catch (error) {
			res.status(401);
			throw new Error('not autherized token');
		}
	} else {
		res.status(401);
		throw new Error('no token at all');
	}
});
module.exports = { protect };
