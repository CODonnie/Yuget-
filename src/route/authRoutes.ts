import express from "express";
import {
  CreateUser,
  loginUser,
  logoutUser,
  users,
} from "../controllers/authControllers";
import guard from "../middlewares/authMiddlewares";

const authRouter = express.Router();

authRouter.post("/register", CreateUser);
authRouter.post("/login", loginUser);
authRouter.get("/logout", guard, logoutUser);
authRouter.get("/users", guard, users);

export default authRouter;
