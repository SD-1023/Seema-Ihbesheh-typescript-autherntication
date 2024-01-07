"use strict";
module.exports = (sequelize, Sequelize) => {
    const book = sequelize.define('book', {
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        isbn: {
            type: Sequelize.STRING, // Change to STRING for alphanumeric ISBN
            allowNull: false,
            unique: true,
        },
        year: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        author: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        pages: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        publisher_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    });
    return book;
};
