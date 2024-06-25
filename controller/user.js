import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { jwtKey } from "../config/db.config.js";
import db from "../model/index.js";
import { sendEmail } from "../service/sendMail.js";
import response, { BAD_REQUEST, INTERNAL_ERROR, INVALID_LOGIN, SUCCESS } from "../utils/response.js";

export const createNewToken = async (id, user) => {
	const token = jwt.sign({ id: id }, jwtKey, { expiresIn: 60 * 60 });
	const updateRecord = await user.update({
		token: token,
	});
	let payloadUser = updateRecord;
	delete payloadUser.dataValues["password"];
	return payloadUser;
};

export const isUserLoggedIn = async (req, res, next) => {
	try {
		const headers = req.headers;
		const clientToken = headers["authorization"]?.split(" ")?.[1] || headers["x-access-token"];
		if (!clientToken) {
			return res.status(400).send({ message: "Need token" });
		}
		var decoded = jwt.verify(clientToken, jwtKey);
		if (!decoded.id) {
			return res.status(400).send({ message: "Invalid token." });
		}
		let user = await db.user.findOne({
			where: {
				id: decoded.id,
			},
		});
		if (!user?.dataValues || user?.dataValues?.token !== clientToken) {
			return res.status(400).send({ message: "Invalid token id." });
		}
		delete user?.dataValues["password"];
		req.user = user;
		next();
	} catch (err) {
		console.log(err);
		return res.status(500).send({ message: INTERNAL_ERROR });
	}
};

export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return response({ res, code: 400, data: null, message: BAD_REQUEST });
		}
		const userFromEmail = await db.user.findOne({
			where: {
				email: email.trim(),
			},
		});
		const isValidPassword = await userFromEmail.validPassword(password, userFromEmail.dataValues.password);
		if (isValidPassword) {
			const payloadUser = await createNewToken(userFromEmail.dataValues.id, userFromEmail);
			return response({
				res,
				code: 200,
				data: payloadUser.toJSON(),
				message: SUCCESS,
			});
		}
		return response({ res, code: 400, data: {}, message: INVALID_LOGIN });
	} catch (err) {
		console.log(err);
		return response({ res, code: 500, data: null, message: INTERNAL_ERROR });
	}
};

export const getUserAll = async (req, res) => {
	try {
		const newUser = await db.user.findAll();
		return response({ res, code: 200, data: newUser, message: SUCCESS });
	} catch (err) {
		return response({ res, code: 500, data: null, message: INTERNAL_ERROR });
	}
};

export const getUserId = async (req, res) => {
	try {
		const id = req.params.id;
		if (!id) {
			return response({
				res,
				code: 403,
				data: newUser,
				message: "Need user id",
			});
		}
		const newUser = await db.user.findOne({
			where: { id },
		});
		return response({ res, code: 200, data: newUser, message: SUCCESS });
	} catch (err) {
		return response({ res, code: 500, data: null, message: INTERNAL_ERROR });
	}
};

export const checkToken = async (req, res) => {
	try {
		const payloadUser = await createNewToken(req.user.id, req.user);
		return response({ res, code: 200, data: payloadUser, message: SUCCESS });
	} catch (err) {
		console.log(err);
		return response({ res, code: 500, data: null, message: INTERNAL_ERROR });
	}
};

export const createUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return response({ res, code: 400, data: null, message: BAD_REQUEST });
		}
		const newUser = await db.user.create({
			...req.body,
		});
		const payloadUser = await createNewToken(newUser.id, newUser);
		return response({
			res,
			code: 200,
			data: payloadUser.dataValues,
			message: SUCCESS,
		});
	} catch (err) {
		console.log(err);
		return response({ res, code: 500, data: null, message: INTERNAL_ERROR });
	}
};

export const logoutUser = async (req, res) => {
	try {
		const payloadUser = await req.user.update({ token: "" });
		return response({ res, code: 200, data: payloadUser, message: SUCCESS });
	} catch (err) {
		console.log(err);
		return response({ res, code: 500, data: null, message: INTERNAL_ERROR });
	}
};

export const sendConfirmationEmail = async (req, res) => {
	try {
		const verificationCode = Math.floor(100000 + Math.random() * 900000);
		const payloadUser = await req.user.update({
			verificationCode: verificationCode,
			verificationCodeExpired: new Date().getTime() + 1000 * 60 * 60,
		});
		const htmlEmailTemplate = `
		<div>
			<h1>Verify your account</h1>
			<p>This is you verification code</p>
			<p>${verificationCode}</p>
		</div>
		`;
		await sendEmail(req.user.email, "Verify your account", "Verify your account", htmlEmailTemplate);
		return response({ res, code: 200, data: payloadUser, message: SUCCESS });
	} catch (err) {
		console.log(err);
		return response({ res, code: 500, data: null, message: INTERNAL_ERROR });
	}
};

export const confirmationVerificationCode = async (req, res) => {
	try {
		const { verificationCode } = req.body;
		const user = await db.user.findOne({
			where: {
				verificationCode: verificationCode,
				verificationCodeExpired: { [Op.gt]: new Date().getTime() },
			},
		});

		if (!user) {
			return response({
				res,
				code: 400,
				data: null,
				message: "Invalid verification code",
			});
		}

		user.update({ verificationCode: "", verified: true });

		return response({ res, code: 200, data: "Verified", message: SUCCESS });
	} catch (err) {
		console.log(err);
		return response({ res, code: 500, data: null, message: INTERNAL_ERROR });
	}
};
