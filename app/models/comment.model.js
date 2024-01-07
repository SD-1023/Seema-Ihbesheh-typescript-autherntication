"use strict";
module.exports = (sequelize, Sequelize) => {
    const comment = sequelize.define('comment', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        comment: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        stars: {
            type: Sequelize.INTEGER, // Use FLOAT for stars if you want decimal values
            allowNull: true,
        },
        book_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    });
    return comment;
};
