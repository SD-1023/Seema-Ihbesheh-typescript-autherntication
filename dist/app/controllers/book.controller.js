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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.topRated = exports.remove = exports.update = exports.create = exports.findOne = exports.findAll = void 0;
const models_1 = __importDefault(require("../models"));
const book = models_1.default.books;
const comment = models_1.default.comments;
const findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.findAll = findAll;
const findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.id;
        if (isNaN(Number(bookId)) || !Number.isInteger(parseFloat(bookId))) {
            return;
        }
        const Book = yield book.findOne({
            where: { id: Number(bookId) },
            include: [
                {
                    model: models_1.default.publishers,
                    // attributes: ['id', 'name'],
                },
                {
                    model: models_1.default.comments,
                    // attributes: ['id', 'name'],
                },
            ],
        });
        if (Book) {
            res.json({
                book: {
                    id: Book.id,
                    title: Book.title,
                },
                publisher: Book.publisher || {},
                comments: Book.comments || [],
            });
        }
        else {
            res.status(404).json({ message: `Book id=${bookId} not found` });
        }
    }
    catch (error) {
        console.error('Error fetching Book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.findOne = findOne;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBook = req.body;
        if (!newBook.title || !newBook.isbn || !newBook.publisher_id) {
            res.status(400).json({ error: 'There are required fields missing' });
            return;
        }
        const books = yield book.create(newBook);
        res.status(201).json(books);
    }
    catch (error) {
        if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
            console.error('Error creating book:', error);
            res.status(400).json({ error: 'ISBN must be unique' });
        }
        else if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
            console.error('Error creating book:', error);
            res.status(400).json({ error: 'publisher_id must exist' });
        }
        else {
            console.error('Error creating book:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});
exports.create = create;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.id;
        const books = yield book.update(req.body, {
            where: { id: Number(bookId) },
        });
        if (books[0] === 1) {
            res.send({
                message: 'Book was updated successfully.',
            });
        }
        else {
            res.send({
                message: `Cannot update Book with id=${bookId}. Maybe Book was not found or req.body is empty!`,
            });
        }
    }
    catch (error) {
        console.error('Error updating book:', error);
        res.status(500).send({
            message: 'Error updating Book.',
        });
    }
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.id;
        const Book = yield book.findByPk(Number(bookId));
        if (!Book) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }
        const deletedComments = yield comment.destroy({
            where: { book_id: Number(bookId) },
        });
        const deletedBook = yield book.destroy({
            where: { id: Number(bookId) },
        });
        res.json({ message: `Book & Comments with id=${bookId} deleted successfully` });
    }
    catch (error) {
        console.error('Error deleting book by id:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.remove = remove;
const topRated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topBooks = yield comment.findAll({
            attributes: [
                'book_id',
                [models_1.default.sequelize.fn('avg', models_1.default.sequelize.col('comment.stars')), 'avgStars'],
            ],
            include: [
                {
                    model: book,
                },
            ],
            group: ['comment.book_id'],
            order: [[models_1.default.sequelize.literal('avgStars'), 'DESC']],
            limit: 10,
        });
        res.json(topBooks);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.topRated = topRated;
