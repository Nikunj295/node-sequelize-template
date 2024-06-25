import dotenv from "dotenv";
dotenv.config();

export default {
  HOST: process.env.HOST || "localhost",
  USER: process.env.USER || "root",
  PASSWORD: process.env.PASSWORD || "",
  DB: process.env.DB || "database",
  dialect: process.env.dialect || "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export const mailerConfig = {
  name: process.env.SENDER_EMAIL_NAME,
  email: process.env.SENDER_EMAIL,
  token: process.env.SENDER_EMAIL_TOKEN,
};

export const saltRounds = 10;
export const jwtKey = process.env.JWT || "admin_jwt_key";
