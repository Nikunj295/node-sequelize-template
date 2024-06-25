import express from "express";
import { isAdmin } from "../../controller/admin.js";
import {
	checkToken,
	confirmationVerificationCode,
	createUser,
	getUserAll,
	getUserId,
	isUserLoggedIn,
	loginUser,
	logoutUser,
	sendConfirmationEmail,
} from "../../controller/user.js";

const userRouter = express.Router();

userRouter.post("/create", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/all", isAdmin, getUserAll);
userRouter.get("/all/:id", isUserLoggedIn, getUserId);
userRouter.post("/checkToken", isUserLoggedIn, checkToken);
userRouter.get("/logout", isUserLoggedIn, logoutUser);
userRouter.post("/send-confirmation", isUserLoggedIn, sendConfirmationEmail);
userRouter.post("/confirm-account", isUserLoggedIn, confirmationVerificationCode);

export default userRouter;
