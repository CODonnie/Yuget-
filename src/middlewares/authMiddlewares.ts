import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();

export type ContextType = {
	req: Request;
	res: Response;
}

const protect = (context: ContextType) => {
	try {
		const { req } = context
		const token = req.cookies.yugetToken || req.headers.authorization?.split(" ")[1];

		if(!token) throw new Error("missing or invalid token");

		const secret = process.env.JWT_SECRET as string;
		const decoded = jwt.verify(token, secret);
		(req as any).user = decoded;
	} catch(error) {
		throw new Error(`authentication error: ${error}`);
	}
};

export default protect;
