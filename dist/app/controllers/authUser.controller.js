"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.logout = exports.signin = exports.signup = exports.findAll = void 0;
const models_1 = __importDefault(require("../models"));
const crypto = __importStar(require("crypto"));
const uuid = require('uuid');
const saltRounds = 10; // You can adjust the number of salt rounds as needed
const emailValidator = require('email-validator');
const { Sequelize, DataTypes } = require('sequelize');
const util = require('util');
const user = models_1.default.users;
const session = models_1.default.sessions;
const findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user.findAll();
        console.log(users);
        res.json(users);
    }
    catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.findAll = findAll;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = req.body;
        // Validate required fields
        if (!newUser.email || !newUser.password) {
            res.status(400).json({ error: 'There are  required filed was missed ' });
            return;
        }
        if (!emailValidator.validate(newUser.email)) {
            console.log(`${newUser.email} is not valid email address.`);
            res.status(500).json({ error: `${newUser.email} is not valid email address.` });
            return;
        }
        // const salt = crypto.randomBytes(16).toString('hex');
        // const hashedPassword = await hashPassword(newUser.password, salt);
        const hashedPassword = hashPassword(newUser.password);
        const users = yield user.create({ email: newUser.email, password: hashedPassword });
        if (!users) {
            res.status(500).json({ error: 'error when create new user' });
        }
        res.status(201).json(users);
    }
    catch (error) {
        console.error('Error creating users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = req.body;
        if (!users.email || !users.password) {
            res.status(400).json({ error: 'There are  required filed was missed ' });
            return;
        }
        const checkUser = yield user.findOne({
            where: { email: users.email }
        });
        if (!checkUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const passwordMatch = comparePasswords(users.password, checkUser.password);
        if (passwordMatch) {
            console.log("Login successful with hash password");
        }
        else {
            res.status(401).json({ message: 'Invalid password' });
        }
        const token = generateSessionToken();
        const newSession = yield session.create({ session: token, user_id: checkUser.id });
        console.log("user, session signin are exist");
        res.status(201).json({ token });
    }
    catch (error) {
        console.error('Error fetching signin :', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.signin = signin;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionFromHeader = req.get('session');
        const deletedSession = yield session.destroy({
            where: { session: sessionFromHeader },
        });
        res.status(201).json("session delete done  ");
    }
    catch (error) {
        console.error('Error fetching logout:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.logout = logout;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = req.body;
        const cuuUser = yield user.findOne({
            where: { email: users.email }
        });
        if (!cuuUser) {
            res.status(404).json({ error: 'User not exist ' });
        }
        //change passwrod
        const hashedPassword = hashPassword(users.password);
        users.password = hashedPassword;
        const userChangePassword = yield user.update({ email: users.email, password: users.password }, {
            where: { email: users.email }
        });
        if (!userChangePassword) {
            res.status(404).json({ error: 'error when change password ' });
        }
        //logout from all sessions
        const deletedAllSession = yield session.destroy({
            where: { user_id: cuuUser.id }
        });
        if (!deletedAllSession) {
            res.status(404).json({ error: 'There are not session to delete' });
        }
        res.status(201).json("change passwrord and delete all session  done  ");
    }
    catch (error) {
        console.error('Error fetching change pass:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.changePassword = changePassword;
function hashPassword(password) {
    const salt = crypto.randomBytes(8).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 500, 64, 'sha256').toString('hex');
    return `${salt}:${hash}`;
}
function comparePasswords(inputPassword, storedHash) {
    if (!storedHash || typeof storedHash !== 'string' || !storedHash.includes(':')) {
        // Handle the case where storedHash is undefined or doesn't have the expected format
        return false;
    }
    const [salt, hash] = storedHash.split(':');
    const inputHash = crypto.pbkdf2Sync(inputPassword, salt, 500, 64, 'sha256').toString('hex');
    return inputHash === hash;
}
//change it tithout salt
function generateSessionToken() {
    // Generate a random session ID
    const sessionId = crypto.randomBytes(16).toString('hex');
    // Generate a random salt for additional security
    const salt = crypto.randomBytes(16).toString('hex');
    // Combine the session ID and salt
    const combinedData = `${sessionId}:${salt}`;
    // Create a SHA-256 hash of the combined data
    const token = crypto.createHash('sha256').update(combinedData).digest('hex');
    return token;
}
