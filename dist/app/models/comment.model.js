"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
//const CommentModel = (sequelize: Sequelize, DataTypes: typeof import('sequelize/types/lib/data-types')) => {
const CommentModel = (sequelize) => {
    const Comment = sequelize.define('comment', {
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        comment: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        stars: {
            type: sequelize_1.DataTypes.INTEGER, // Use FLOAT for stars if you want decimal values
            allowNull: true,
        },
        book_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
    });
    return Comment;
};
exports.default = CommentModel;
