import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
	try {
		const mongo = process.env.MONGO_URI as string;
		const conn = await connect(mongo);
		console.log(`db conmected: ${conn.connection.host}`);
	} catch(error) {
		throw new Error(`db connection error: ${error}`);
	}
};

export default connectDb;
