import swaggerAutogen from "swagger-autogen";
/* Swagger configuration */
const options = {
	openapi: "OpenAPI 3",
	language: "en-US", // Change response language. By default is 'en-US'
	disableLogs: false, // Enable/Disable logs. By default is false
	autoHeaders: false, // Enable/Disable automatic headers capture. By default is true
	autoQuery: false, // Enable/Disable automatic query capture. By default is true
	autoBody: true, // Enable/Disable automatic body capture. By default is true
};

const doc = {
	info: {
		version: "3.0.0", // by default: '1.0.0'
		title: "Node Template", // by default: 'REST API'
		description: "Node Template", // by default: ''
		contact: {
			name: "API Support",
			email: "test@gmail.com",
		},
	},
	securityDefinitions: {},
	tags: [
		{
			name: "User",
			description: "User related endpoints",
		},
	],
	paths: {},
};

const outputFile = "./docs/swagger.json";
const endpointsFiles = ["./index.js", "./route/index.js"];

swaggerAutogen(options)(outputFile, endpointsFiles, doc);
