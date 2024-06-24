import mongoose, { Error } from 'mongoose';

const connectDB = async () => {
	const connUrl = process.env.MONGODB_CONNECTION_STRING as string;
	console.log("🚀 ~ file: db.ts:5 ~ connectDB ~ connUrl:", connUrl);


	try {
		const conn = await mongoose.connect(connUrl);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.log("🚀 ~ file: db.ts:10 ~ connectDB ~ error:", error);

		if (error instanceof Error) {
			console.log(`Error: ${error.message}`);
		}
		process.exit(1);
	}
};
export default connectDB;
