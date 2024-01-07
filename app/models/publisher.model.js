"use strict";
module.exports = (sequelize, Sequelize) => {
    const publisher = sequelize.define('publisher', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        country: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    });
    return publisher;
};
