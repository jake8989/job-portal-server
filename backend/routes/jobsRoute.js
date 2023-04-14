const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Jobs = require('../models/jobsModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect } = require('../middlewares/authHandler');
router.post(
	'/create-jobs',
	protect,
	asyncHandler(async (req, res) => {
		const { company, position, description } = req.body;
		if (!company || !position) {
			// res.status(400).json({ message: 'Empty fields' });
			throw new Error('Not Good for server🥲');
		}
		req.body.createdBy = req.user._id;

		console.log(req.body.createdBy);
		const job = await Jobs.create(req.body);
		res.status(200).json({ job, message: 'Job Created' });
	})
);
router.get(
	'/get-jobs',
	protect,
	asyncHandler(async (req, res, next) => {
		const jobs = await Jobs.find({});
		res.status(200).json({ totalCount: jobs.length, jobs });
	})
);
router.put(
	'/update-job/:id',
	protect,
	asyncHandler(async (req, res) => {
		const job = await Jobs.findById(req.params.id);
		console.log(job);
		if (!job) {
			throw new Error(`No match found for job ${req.params.id}`);
		}
		console.log(req.user);
		if (req.user._id.toString() !== job.createdBy.toString()) {
			console.log(req.user._id);
			throw new Error('Cannot perform this action');
		}
		const { position, description, deadline, workType } = req.body;
		job.position = position;
		job.description = description;
		job.deadline = deadline;
		job.workType = workType;
		await job.save();
		res.status(200).json({ job, message: 'Updated Succesfully' });
	})
);
router.delete(
	'/delete-job/:id',
	protect,
	asyncHandler(async (req, res) => {
		const job = await Jobs.findById(req.params.id);
		console.log(job);
		if (!job) {
			throw new Error(`No match found for job ${req.params.id}`);
		}
		console.log(req.user);
		if (req.user._id.toString() !== job.createdBy.toString()) {
			console.log(req.user._id);
			throw new Error('Cannot perform this action');
		}
		await Jobs.findByIdAndDelete(req.params.id);
		res
			.status(200)
			.json({ job, message: `Deleted Succesfully ${req.params.id}` });
	})
);
module.exports = router;
