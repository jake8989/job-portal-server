const mongoose = require('mongoose');
const jobsSchema = mongoose.Schema(
	{
		company: {
			type: String,
			require: true['This field is required'],
		},
		position: {
			type: String,
			require: true['this field is required'],
		},
		description: {
			type: String,
			default: 'Job listed!',
		},
		deadLine: {
			type: String,
			default: 'No deadline for applying',
		},
		status: {
			type: String,
			enum: ['Pending', 'Rejected', 'Interview', 'Internship'],
			default: 'Pending',
		},
		workType: {
			type: String,
			enum: ['Work-From-Home', 'Part-Time', 'Full-Time', 'Intership'],
			default: 'Part-Time',
		},
		workLocation: {
			type: String,
			default: 'Empty',
			require: true['Work location is required'],
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);
module.exports = mongoose.model('Jobs', jobsSchema);
