import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
	try {
		const connection = await mongoose.connect(
			process.env.MONGODB_URI as string
		);
		console.log(`MongoDB connected: ${connection.connection.host}`);
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
		process.exit(1); // Exit the process with failure
	}
};

export default connectDB;
	