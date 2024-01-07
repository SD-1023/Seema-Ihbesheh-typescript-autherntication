"use strict";
const authorization = require("../controllers/authorization.js");
module.exports = app => {
    const users = require("../controllers/authUser.controller.js");
    var router = require("express").Router();
    router.get('/auth', users.findAll);
    router.post('/auth-signup', users.signup);
    router.post('/auth-signin', users.signin);
    router.post('/auth-change-password', users.changePassword);
    router.use(authorization);
    router.post('/auth-logout', users.logout);
    app.use('/api', router);
};
6;
