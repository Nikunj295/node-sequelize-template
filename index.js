import dotenv from "dotenv";
import express from "express";
import { readFileSync } from "fs";
import path, { dirname } from "path";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: `${__dirname}/.env` });

import bodyParser from "body-parser";
import cors from "cors";
import router from "./route/index.js";

const swaggerDocument = JSON.parse(readFileSync(path.join(__dirname, "./docs/swagger.json"), "utf8"));

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerDocument, {
		explorer: true,
	})
);

app.get("/", (req, res) => {
	return res.json({ message: "Hi", data: {} });
});

router(app);

app.listen(process.env.PORT, () => {
	console.log(`Server started on ${process.env.PORT}...`);
});
