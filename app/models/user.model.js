"use strict";
module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define('user', {
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type: Sequelize.TEXT,
            allowNull: false,
        }
    });
    return user;
};
