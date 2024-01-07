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
var crypto = require('crypto');
const uuid = require('uuid');
const saltRounds = 10; // You can adjust the number of salt rounds as needed
const emailValidator = require('email-validator');
const Op = db.Sequelize.Op;
const { Sequelize, DataTypes } = require('sequelize');
const util = require('util');
const user = db.users;
const session = db.sessions;
exports.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = req.body;
        // Validate required fields
        if (!newUser.email || !newUser.password) {
            res.status(400).json({ error: 'There are  required filed was missed ' });
            return;
        }
        if (!emailValidator.validate(newUser.email)) {
            console.log(`${newUser.email} is not valid email address.`);
            //res.status(500).json({ error: `${newUser.email} is not valid email address.` });
            return;
        }
        // const salt = crypto.randomBytes(16).toString('hex');
        // const hashedPassword = await hashPassword(newUser.password, salt);
        const hashedPassword = hashPassword(newUser.password);
        const users = yield user.create({ email: newUser.email, password: hashedPassword });
        if (!users) {
            res.status(404).json({ error: 'error when create new user' });
        }
        res.status(201).json(users);
    }
    catch (error) {
        console.error('Error creating users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = req.body;
        const checkUser = yield user.findOne({
            where: { email: users.email }
        });
        if (!checkUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Save the token in the Session table or any other secure storage
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
        res.status(201).json(checkUser);
    }
    catch (error) {
        console.error('Error fetching signin :', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionFromHeader = req.get('session');
        // const { token } = req.body;
        // const checkUser = await session.findOne({
        //   where: { session: sessionFromHeader }
        // });
        //  if (!checkUser) {
        //    return res.status(404).json({ error: 'session not found' });
        //  }
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
exports.changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
