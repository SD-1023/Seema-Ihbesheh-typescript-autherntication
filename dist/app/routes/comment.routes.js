"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("../controllers/comment.controller");
const router = express_1.default.Router();
//router.use(authorization);
router.get('/comment', comment_controller_1.findAll);
router.get('/comment/:id', comment_controller_1.findByPk);
router.post('/comment', comment_controller_1.create);
router.delete('/comment/:id', comment_controller_1.remove);
const setupCommentRoutes = (app) => {
    app.use('/api', router);
};
exports.default = setupCommentRoutes;
