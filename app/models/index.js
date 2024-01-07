"use strict";
const dbConfig = require("../config/db.config.js");
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    define: {
        freezeTableName: true,
    },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.books = require("./book.model.js")(sequelize, Sequelize);
db.publishers = require("./publisher.model.js")(sequelize, Sequelize);
db.comments = require("./comment.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
db.sessions = require("./session.model.js")(sequelize, Sequelize);
db.books.belongsTo(db.publishers, { foreignKey: 'publisher_id', targetKey: 'id' });
db.publishers.hasMany(db.books, { foreignKey: 'publisher_id', sourceKey: 'id' });
db.comments.belongsTo(db.books, { foreignKey: 'book_id', targetKey: 'id' });
db.books.hasMany(db.comments, { foreignKey: 'book_id', targetKey: 'id' });
db.sessions.belongsTo(db.users, { foreignKey: 'user_id', targetKey: 'id' });
db.users.hasMany(db.sessions, { foreignKey: 'user_id', targetKey: 'id' });
module.exports = db;
