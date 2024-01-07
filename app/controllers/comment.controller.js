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
const comment = db.comments;
const Op = db.Sequelize.Op;
exports.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield comment.findAll();
        res.json(comments);
    }
    catch (error) {
        console.error('Error fetching all comments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.findByPk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment_Id = req.params.id;
        if (isNaN(comment_Id) || !Number.isInteger(parseFloat(comment_Id))) {
            return res.status(400).json({ error: 'Invalid ID. ID must be an integer.' });
        }
        const Comment = yield comment.findByPk(comment_Id);
        res.json(Comment);
    }
    catch (error) {
        console.error('Error fetching Comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newComment = req.body;
        // Validate required fields
        if (!newComment.name || !newComment.comment || !newComment.book_id) {
            res.status(400).json({ error: 'There are  required filed was missed ' });
            return;
        }
        const comments = yield comment.create(newComment);
        res.status(201).json(comments);
    }
    catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            console.error('Error creating comment:', error);
            res.status(400).json({ error: 'book_id must me exist for  book' });
            //SequelizeForeignKeyConstraintError
        }
        else {
            console.error('Error creating comment:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});
exports.delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment_Id = req.params.id;
        const Comment = yield comment.findByPk(comment_Id);
        if (!Comment) {
            console.log("no Comment with this id");
            // res.json("no Comment with this id");
            res.status(404).json({ error: 'Comment not found' });
            return;
        }
        const deletedComment = yield comment.destroy({
            where: { id: comment_Id },
        });
        res.json({ message: `comment with id = ${comment_Id} deleted successfully` });
    }
    catch (error) {
        console.error('Error deleting comment by id:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
