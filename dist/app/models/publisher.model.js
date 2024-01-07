"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const PublisherModel = (sequelize) => {
    const Publisher = sequelize.define('publisher', {
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
    });
    return Publisher;
};
exports.default = PublisherModel;
