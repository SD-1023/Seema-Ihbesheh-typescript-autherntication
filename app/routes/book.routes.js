"use strict";
const authorization = require("../controllers/authorization.js");
module.exports = app => {
    const books = require("../controllers/book.controller.js");
    var router = require("express").Router();
    router.use(authorization);
    router.get('/book', books.findAll);
    router.get('/book/:id', books.findOne);
    router.post('/book', books.create);
    router.put('/book/:id', books.update);
    router.delete('/book/:id', books.delete);
    router.get('/books/topRated', books.topRated);
    app.use('/api', router);
};
