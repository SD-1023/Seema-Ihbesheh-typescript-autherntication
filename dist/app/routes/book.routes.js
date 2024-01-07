"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("../controllers/book.controller");
const router = express_1.default.Router();
//router.use(authorization);
router.get('/book', book_controller_1.findAll);
router.get('/book/:id', book_controller_1.findOne);
router.post('/book', book_controller_1.create);
router.put('/book/:id', book_controller_1.update);
router.delete('/book/:id', book_controller_1.remove);
router.get('/books/topRated', book_controller_1.topRated);
const configureRoutes = (app) => {
    app.use('/api', router);
};
exports.default = configureRoutes;
