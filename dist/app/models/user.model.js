"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const UserModel = (sequelize) => {
    const User = sequelize.define('user', {
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
    });
    return User;
};
exports.default = UserModel;
