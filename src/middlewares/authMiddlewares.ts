import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const guard = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies.yugetToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "missing or invalid token" });
      return;
    }

    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.log(`auth shiko - ${error}`);
    res.status(500).json({ message: `auth error ${error}` });
  }
};

export default guard;
