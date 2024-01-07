"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing necessary modules
const db_config_1 = __importDefault(require("../config/db.config"));
const sequelize_typescript_1 = require("sequelize-typescript");
// Creating a new Sequelize instance
const sequelize = new sequelize_typescript_1.Sequelize(db_config_1.default.DB, db_config_1.default.user, db_config_1.default.password, {
    host: db_config_1.default.host,
    dialect: 'mysql',
    define: {
        freezeTableName: true,
    },
});
const db = {
    Sequelize: sequelize_typescript_1.Sequelize,
    sequelize,
    books: require("./book.model").default(sequelize, sequelize_typescript_1.Sequelize),
    publishers: require("./publisher.model").default(sequelize, sequelize_typescript_1.Sequelize),
    comments: require("./comment.model").default(sequelize, sequelize_typescript_1.Sequelize),
    users: require("./user.model").default(sequelize, sequelize_typescript_1.Sequelize),
    sessions: require("./session.model").default(sequelize, sequelize_typescript_1.Sequelize),
};
// Defining associations
db.books.belongsTo(db.publishers, { foreignKey: 'publisher_id', targetKey: 'id' });
db.publishers.hasMany(db.books, { foreignKey: 'publisher_id', sourceKey: 'id' });
db.comments.belongsTo(db.books, { foreignKey: 'book_id', targetKey: 'id' });
db.books.hasMany(db.comments, { foreignKey: 'book_id', targetKey: 'id' });
db.sessions.belongsTo(db.users, { foreignKey: 'user_id', targetKey: 'id' });
db.users.hasMany(db.sessions, { foreignKey: 'user_id', targetKey: 'id' });
exports.default = db;
