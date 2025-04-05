import { Request, Response }from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//@desc - create user
//@route - POST/api/auth/register
export const CreateUser = async (req: Request, res: Response) => {
	try {
		const { name, email, role, password } = req.body;

		let user = await User.findOne({ email });
		if(user) {
			res.status(400).json({ message: "user already exist" });
			throw new Error(`User ${email} already exists`);
		}

		user = new User({ name, email, role, password });
		await user.save();

		res.status(200).json({ message: "user created", user });
	} catch(error) {
		res.status(500).json({ message: "internal server error" });
		throw new Error(`signup error: ${error}`);
	}
};

//@desc - login user
//@route - POST/api/auth/login
export const loginUser = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		
		let user = await User.findOne({ email });
		if (!user) {
			res.status(400).json({ message: "user not found" });
			throw new Error(`User ${email} not found`);
		}

		const isMatch = await user.comparePasswords(password);
		if(!isMatch) throw new Error("incorrect credentials");

		const secret = process.env.JWT_SECRET as string;
		const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: "1d" });

		res.cookie("yugetToken", token, {
			httpOnly: true,
			sameSite: "strict",
			secure: process.env.NODE_ENV === "production",
			maxAge: 1 * 24 * 60 * 60 * 1000
		});

		console.log(`${user.name} logged in`);
		res.status(200).json({ message: `${user.name} logged in` });
	} catch(error) {
		res.status(500).json({ message: "internal server error" });
		throw new Error(`login error: ${error}`);
	}
};

//@desc - logout user
//@route - POST/api/auth/logout
export const logoutUser = (req: Request, res: Response) => {
	try {
		res.clearCookie("yugetToken");

		console.log(`user logged out`);
		res.status(200).json({ message: "user logged out" });
	} catch(error) {
		res.status(500).json({ message: "internal server error" });
		throw new Error(`logout error: ${error}`);
	}
};

//@desc - users
//@route - GET/api/users
export const users = async (req: Request, res: Response) => {
	try {
		const users = await User.find();
		if(!users) throw new Error("users not retrieved");

		res.status(200).json({ message: "users retrieved", users });
	} catch(error) {
		res.status(500).json({ message: "internal server error" });
		throw new Error(`users retrieval error: ${error}`);
	}
}
