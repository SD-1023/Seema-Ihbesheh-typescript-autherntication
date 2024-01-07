"use strict";
module.exports = (sequelize, Sequelize) => {
    const session = sequelize.define('session', {
        session: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
    });
    return session;
};
