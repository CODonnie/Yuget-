import User from "../models/userModel";
import { Input } from "../resolvers";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ContextType } from "../middlewares/authMiddlewares";

dotenv.config();

//@desc - create user
//@query: mutation{ signup(args) {data} }
export const CreateUser = async (args: Input) => {
	try {
		const { name, email, password } = args;

		let user = await User.findOne({ email });
		if(user) throw new Error(`User ${email} already exists`);

		user = new User({ name, email, password });
		await user.save();

		return user;
	} catch(error) {
		throw new Error(`signup error: ${error}`);
	}
};

//@desc - login user
//@query: mutation{ login(args, context) }
export const loginUser = async (args: Input, context: ContextType) => {
	try {
		const { email, password } = args;
		const { res } = context;
		
		let user = await User.findOne({ email });
		if (!user) throw new Error(`User ${email} not found`);

		const isMatch = await user.comparePasswords(password);
		if(!isMatch) throw new Error("incorrect credentials");

		const secret = process.env.JWT_SECRET as string;
		const token = jwt.sign({id: user.id}, secret, { expiresIn: "1d" });

		res.cookie("yugetToken", token, {
			httpOnly: true,
			sameSite: "strict",
			secure: process.env.NODE_ENV === "production",
			maxAge: 1 * 24 * 60 * 60 * 1000
		});

		console.log(`${user.name} logged in`);
		return true;
	} catch(error) {
		throw new Error(`login error: ${error}`);
	}
};

//@desc - logout user
//@query: mutation{ logout(context) }
export const logoutUser = (context: ContextType) => {
	try {
		const { res } = context;
		res.clearCookie("yugetToken");

		console.log(`user logged out`);
		return true;
	} catch(error) {
		throw new Error(`logout error: ${error}`);
	}
};

//desc - users
//@query: query{ users { name, email, crearedAt } }
export const users = async () => {
	try {
		const users = await User.find();
		if(!users) throw new Error("users not retrieved");

		return users;
	} catch(error) {
		throw new Error(`users retrieval error: ${error}`);
	}
}
