"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const BookModel = (sequelize) => {
    const Book = sequelize.define('book', {
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        isbn: {
            type: sequelize_1.DataTypes.STRING, // Change to STRING for alphanumeric ISBN
            allowNull: false,
            unique: true,
        },
        year: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        author: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        pages: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        publisher_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
    });
    return Book;
};
exports.default = BookModel;
