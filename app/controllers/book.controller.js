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
const book = db.books;
const comment = db.comments;
const Op = db.Sequelize.Op;
const { Sequelize, DataTypes } = require('sequelize');
exports.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield book.findAll();
        console.log(books);
        res.json(books);
    }
    catch (error) {
        console.error('Error fetching all books:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.id;
        //return just one book findOne
        if (isNaN(bookId) || !Number.isInteger(parseFloat(bookId))) {
            return res.status(400).json({ error: 'Invalid ID. ID must be an integer.' });
        }
        const Book = yield book.findOne({
            where: { id: bookId },
            include: [
                {
                    model: db.publishers,
                    // attributes: ['id', 'name'],
                },
                {
                    model: db.comments,
                    //attributes: ['id', 'name'],
                },
            ],
        });
        if (Book) {
            res.json({
                book: {
                    id: Book.id,
                    title: Book.title,
                },
                publisher: Book.publisher || {}, // Use empty object if publisher is not present
                comments: Book.comments || [], // Use empty array if comments are not present
            });
        }
        else {
            res.status(404).json({ message: `Book id= ${bookId} not found` });
        }
    }
    catch (error) {
        console.error('Error fetching Book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBook = req.body;
        // Validate required fields
        if (!newBook.title || !newBook.isbn || !newBook.publisher_id) {
            res.status(400).json({ error: 'There are  required filed was missed ' });
            return;
        }
        const books = yield book.create(newBook);
        res.status(201).json(books);
    }
    catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.error('Error creating book:', error);
            res.status(400).json({ error: 'ISBN must be unique' });
        }
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            console.error('Error creating book:', error);
            res.status(400).json({ error: 'publisher_id must me exist' });
            //SequelizeForeignKeyConstraintError
        }
        else {
            console.error('Error creating book:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});
exports.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book_id = req.params.id;
        const books = yield book.update(req.body, {
            where: { id: book_id }
        })
            .then(affectedRowsCount => {
            if (affectedRowsCount == 1) {
                res.send({
                    message: "Tutorial was updated successfully."
                });
            }
            else {
                res.send({
                    message: `Cannot update Tutorial with id=${book_id}. Maybe Tutorial was not found or req.body is empty!`
                });
            }
        })
            .catch(err => {
            res.status(500).send({
                message: "Error updating Tutorial with id=" + book_id
            });
        });
        res.status(201).json(books);
    }
    catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book_Id = req.params.id;
        const Book = yield book.findByPk(book_Id);
        if (!Book) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }
        const deletedComments = yield comment.destroy({
            where: { book_id: book_Id },
        });
        const deletedBook = yield book.destroy({
            where: { id: book_Id },
        });
        res.json({ message: `Book & Comments  with id = ${book_Id} deleted successfully` });
    }
    catch (error) {
        console.error('Error deleting book by id:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.topRated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topBooks = yield comment.findAll({
            attributes: [
                'book_id',
                [db.sequelize.fn('avg', db.sequelize.col('comment.stars')), 'avgStars']
            ],
            include: [{
                    model: book,
                }],
            group: ['comment.book_id'], // Group by non-aggregated columns
            order: [[db.sequelize.literal('avgStars'), 'DESC']],
            limit: 10,
        });
        res.json(topBooks);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
