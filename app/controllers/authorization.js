"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const db = require("../models");
const session = db.sessions;
const authorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionFromHeader = req.get('session');
        // const { token } = req.body;
        const checkUser = yield session.findOne({
            where: { session: sessionFromHeader }
        });
        if (!checkUser) {
            return res.status(404).json({ error: 'session not found' });
        }
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
});
module.exports = authorization;
