import nodemailer from "nodemailer";
import { mailerConfig } from "../config/db.config.js";

const name = mailerConfig.name;
const email = mailerConfig.email;
const password = mailerConfig.token;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: password,
  },
});

export const sendEmail = async (to, subject, text, html) => {
  transporter
    .sendMail({
      from: `"${name}" <${email}>`, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    })
    .then((info) => {
      console.log({ info });
      return info;
    })
    .catch(console.error);
};
