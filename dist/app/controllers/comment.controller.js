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
exports.remove = exports.create = exports.findByPk = exports.findAll = void 0;
const models_1 = __importDefault(require("../models"));
const comment = models_1.default.comments;
const findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield comment.findAll();
        res.json(comments);
    }
    catch (error) {
        console.error('Error fetching all comments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.findAll = findAll;
const findByPk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = req.params.id;
        if (isNaN(Number(commentId)) || !Number.isInteger(parseFloat(commentId))) {
            return;
        }
        const Comment = yield comment.findByPk(Number(commentId));
        res.json(Comment);
    }
    catch (error) {
        console.error('Error fetching Comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.findByPk = findByPk;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newComment = req.body;
        // Validate required fields
        if (!newComment.name || !newComment.comment || !newComment.book_id) {
            res.status(400).json({ error: 'There are required fields missing' });
            return;
        }
        const comments = yield comment.create(newComment);
        res.status(201).json(comments);
    }
    catch (error) {
        if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
            console.error('Error creating comment:', error);
            res.status(400).json({ error: 'book_id must exist for book' });
        }
        else {
            console.error('Error creating comment:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});
exports.create = create;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = req.params.id;
        const Comment = yield comment.findByPk(commentId);
        if (!Comment) {
            console.log("No Comment with this id");
            res.status(404).json({ error: 'Comment not found' });
            return;
        }
        const deletedComment = yield comment.destroy({
            where: { id: commentId },
        });
        res.json({ message: `Comment with id=${commentId} deleted successfully` });
    }
    catch (error) {
        console.error('Error deleting comment by id:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.remove = remove;
