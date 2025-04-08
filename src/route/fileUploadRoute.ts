import express, { Request, Response } from "express";
import upload from "../middlewares/stroageMiddleware";
import FileModel from "../models/fileModel";
import guard from "../middlewares/authMiddlewares";
import uploadRateLimit from "../utils/rateLimiter";

const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "no file uploaded" });
      throw new Error("no file uplaoded");
    }

    const { filename, mimetype, size } = req.file;
    const fileUrl = `/uploads/${filename}`;
    const uploadedBy = (req as any).user?.id;

    const file = new FileModel({
      filename,
      fileUrl,
      mimetype,
      size,
      uploadedBy,
    });

    await file.save();
    res.status(200).json({ message: "file uploaded", fileUrl });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    throw new Error(`upload file error: ${error}`);
  }
};

const fileRouter = express.Router();

fileRouter.post("/upload", guard, uploadRateLimit, upload.single("file"), uploadFile);

export default fileRouter;
