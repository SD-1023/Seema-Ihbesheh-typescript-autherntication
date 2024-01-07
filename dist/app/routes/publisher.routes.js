"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authorization_1 = __importDefault(require("../controllers/authorization"));
const express_1 = __importDefault(require("express"));
const publisher_controller_1 = require("../controllers/publisher.controller");
const router = express_1.default.Router();
//router.use(authorization);
router.get('/publisher', authorization_1.default, publisher_controller_1.findAll);
router.get('/publisher/:id', publisher_controller_1.findByPk);
router.post('/publisher', publisher_controller_1.create);
router.put('/publisher/:id', publisher_controller_1.update);
router.delete('/publisher/:id', publisher_controller_1.remove);
const setupPublisherRoutes = (app) => {
    app.use('/api', router);
};
exports.default = setupPublisherRoutes;
