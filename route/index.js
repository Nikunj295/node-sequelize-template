import userRouter from "./user/index.js";

export default (app) => {
	app.use(
		"/user",
		userRouter
		/* 
    #swagger.tags = ['User']
    */
	);
};
