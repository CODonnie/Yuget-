import express from "express";
import guard from "../middlewares/authMiddlewares";
import { getAllFiles, getFiles } from "../controllers/fileController";

const fileRetRouter = express.Router();

fileRetRouter.get("/files-get/:id", guard, getFiles);
fileRetRouter.get("/all-files-get", guard, getAllFiles);

export default fileRetRouter;
