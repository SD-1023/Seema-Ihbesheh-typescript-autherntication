"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 3001;
const models_1 = __importDefault(require("./app/models"));
models_1.default.sequelize.sync()
    .then(() => {
    console.log('Connection has been established successfully.');
})
    .catch((error) => {
    console.error('Unable to connect to the database:', error);
});
app.get("/", (req, res) => {
    res.json({ message: "welcom to nodejs app" });
});
const book_routes_1 = __importDefault(require("./app/routes/book.routes"));
const publisher_routes_1 = __importDefault(require("./app/routes/publisher.routes"));
const comment_routes_1 = __importDefault(require("./app/routes/comment.routes"));
const authUser_routes_1 = __importDefault(require("./app/routes/authUser.routes"));
(0, book_routes_1.default)(app);
(0, publisher_routes_1.default)(app);
(0, comment_routes_1.default)(app);
(0, authUser_routes_1.default)(app);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
