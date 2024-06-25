import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { saltRounds } from "../config/db.config.js";

export default (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
    {
      name: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      token: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      verificationCode: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      verificationCodeExpired: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const genSalt = await bcrypt.genSalt(saltRounds);
            const newPassword = await bcrypt.hash(user.password, genSalt);
            user.password = newPassword;
          }
        },
      },
    },
  );

  User.prototype.validPassword = async (password, hash) => {
    return bcrypt.compareSync(password, hash);
  };

  // Todo use this method to get user data
  User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    delete values.verificationCode;
    delete values.verificationCodeExpired;
    return values;
  };

  return User;
};
