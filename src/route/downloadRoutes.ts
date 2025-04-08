import express from "express";
import {downloadFile, downloadLink, generateLink} from "../controllers/fileController";
import guard from "../middlewares/authMiddlewares";

const downloadRouter = express.Router();

downloadRouter.get("/file/:id/download", guard, downloadFile);
downloadRouter.post("/create_link/:id", guard, generateLink);
downloadRouter.get("/file_link/:token", downloadLink);

export default downloadRouter;
