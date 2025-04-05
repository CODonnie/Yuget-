import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./config/dbConnect";
import fileRouter from "./route/fileUploadRoute";
import authRouter from "./route/authRoutes";
import { errorHandler, notFound } from "./middlewares/errorMiddleware";
import fileRetRouter from "./route/fileRetrievalRoute";
//Init
dotenv.config();
connectDb();
const app = express();
const port = process.env.PORT || 4000;

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.use("/api/auth", authRouter);
app.use("/api", fileRouter);
app.use("/api", fileRetRouter);
app.use("/uploads", express.static("uploads"));

//Error Middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`server running on localhost:${port}`));
