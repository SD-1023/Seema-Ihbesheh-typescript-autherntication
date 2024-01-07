"use strict";
const authorization = require("../controllers/authorization.js");
module.exports = app => {
    const publishers = require("../controllers/publisher.controller.js");
    var router = require("express").Router();
    router.use(authorization);
    router.get('/publisher', publishers.findAll);
    router.get('/publisher/:id', publishers.findByPk);
    router.post('/publisher', publishers.create);
    router.put('/publisher/:id', publishers.update);
    router.delete('/publisher/:id', publishers.delete);
    app.use('/api', router);
};
