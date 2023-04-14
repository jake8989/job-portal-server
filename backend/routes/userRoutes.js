const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect } = require('../middlewares/authHandler');
router.post(
	'/',
	asyncHandler(async (req, res) => {
		const { name, email, password, role } = req.body;
		console.log(name, email, password, role);
		const userExits = await User.findOne({ email });
		try {
			if (userExits) {
				res.status(400);
				throw new Error('email already exits');
			}
		} catch {
			res.json({ message: 'Email already exists' });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const user = await User.create({
			name: name,
			email: email,
			password: hashedPassword,
			role,
		});
		if (user) {
			res.json({
				user,
				token: generateToken(user._id),
			});
			localStorage.setItem('user', JSON.stringify({ token }));
		} else {
			res.status(400);
			throw new Error('Server not working');
		}
	})
);
router.post(
	'/login',
	asyncHandler(async (req, res) => {
		// res.json({ message: 'login user' });
		const { email, password } = req.body;
		const user = await User.findOne({ email: email });
		try {
			if (user && (await bcrypt.compare(password, user.password))) {
				res.status(200);
				res.json({
					user,
					message: 'logged in succesfully',
					token: generateToken(user._id),
				});
				localStorage.setItem('user', JSON.stringify({ token }));
				console.log('userRoutes', req.user);
			} else {
				throw new Error('no user found');
			}
		} catch (error) {
			res.status(400);
			res.json({ message: 'No user found' });
			console.log(err);
		}
	})
);
router.put(
	'/update-user',
	protect,
	asyncHandler(async (req, res, next) => {
		const { name, email, password, about } = req.body;
		const user = await User.findById(req.user._id);
		console.log(req.user._id);
		try {
			if (user) {
				const salt = await bcrypt.genSalt(10);
				const hashedPassword = await bcrypt.hash(password, salt);
				user.name = name;
				user.email = email;
				user.password = hashedPassword;
				user.role = 'Updated user';
				await user.save();
				token = generateToken(req.user.userId);
				res.status(200).json({ user, message: 'updated succesfully', token });
			} else {
				// res.status(401);s
				throw new Error('no user found');
			}
		} catch (error) {
			res.status(400);
			res.json({ message: 'Cannnot update the user' });
		}
	})
);
router.put(
	'/role',
	protect,
	asyncHandler(async (req, res) => {
		const user = await User.findOne(req.user._id);
		console.log(user);
		const updatedUser = await User.findByIdAndUpdate(
			user._id,
			{ role: 'ADDFOR' },
			{
				new: true,
			}
		);
		res.json({ user });
	})
);

router.get(
	'/me',
	protect,
	asyncHandler((req, res) => {
		res.json({ message: 'get info about user' });
	})
);
//generate JWT Token
const generateToken = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: '1d',
	});
};
module.exports = router;
