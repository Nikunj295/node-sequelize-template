import dbConfig from "../config/db.config.js";
import Sequelize from "sequelize";

import userModel from "./user.model.js";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

/**
 * Bind tables.
 */

db.user = userModel(sequelize, Sequelize);

/**
 *  Initialize the file, this will create table for that model
 * 	- alter: true, it will alter the table without dropping data
 * */
db.sequelize
  .sync({ alter: true, logging: false })
  .then(async () => {
    const adminExists = await db.user.findOne({ where: { admin: true } });
    if (!adminExists) {
      await db.user.create({
        name: "Admin",
        username: "admin_user",
        email: "admin@example.com",
        password: "admin@123",
        admin: true,
      });
      console.log("Default admin user created.");
    }
    console.log("Table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

export default db;
