const mongoose = require('mongoose');

const connectDb = async () => {
	try {
		const conn = await mongoose.connect(process.env.DB_URL);
		console.log(`Mongo Connected Succesfully`.bgCyan);
	} catch {
		console.log('Error in connecting to DB!'.bgRed);
		process.exit(1);
	}
};

module.exports = connectDb;
