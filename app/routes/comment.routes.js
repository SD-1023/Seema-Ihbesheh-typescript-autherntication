"use strict";
const authorization = require("../controllers/authorization.js");
module.exports = app => {
    const comments = require("../controllers/comment.controller.js");
    var router = require("express").Router();
    router.use(authorization);
    router.get('/comment', comments.findAll);
    router.get('/comment/:id', comments.findByPk);
    router.post('/comment', comments.create);
    router.delete('/comment/:id', comments.delete);
    app.use('/api', router);
};
