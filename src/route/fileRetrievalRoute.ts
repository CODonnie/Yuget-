import express from "express";
import guard from "../middlewares/authMiddlewares";
import { deleteFiles, downloadFile, getAllFiles, getFiles } from "../controllers/fileController";

const fileRetRouter = express.Router();

fileRetRouter.get("/file/:id", guard, getFiles);
fileRetRouter.get("/all-files", guard, getAllFiles);
fileRetRouter.delete("/file/:id", guard, deleteFiles);
fileRetRouter.get("/file/:id/download", guard, downloadFile);

export default fileRetRouter;
