"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const SessionModel = (sequelize) => {
    const Session = sequelize.define('session', {
        session: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
    });
    return Session;
};
exports.default = SessionModel;
