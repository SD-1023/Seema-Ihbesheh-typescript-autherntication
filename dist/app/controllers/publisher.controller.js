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
exports.remove = exports.update = exports.create = exports.findByPk = exports.findAll = void 0;
const models_1 = __importDefault(require("../models"));
const publisher = models_1.default.publishers;
const findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!publisher) {
            throw new Error('Publisher model is undefined or null.');
        }
        const publishers = yield publisher.findAll();
        console.log(publishers);
        res.json(publishers);
    }
    catch (error) {
        console.error('Error fetching all publishers:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.findAll = findAll;
//to do: publishe/book
const findByPk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publisherId = req.params.id;
        // Check if publisherId is a valid integer
        if (isNaN(Number(publisherId)) || !Number.isInteger(parseFloat(publisherId))) {
            return; // to do : res
        }
        const Publisher = yield publisher.findByPk(Number(publisherId));
        if (!Publisher) {
            return; // to do : res
        }
        res.json(Publisher);
    }
    catch (error) {
        console.error('Error fetching Publisher:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.findByPk = findByPk;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPublisher = req.body;
        // Validate required fields
        if (!newPublisher.name) {
            res.status(400).json({ error: 'Name is required for a publisher' });
            return;
        }
        const publishers = yield publisher.create(newPublisher);
        res.status(201).json(publishers);
    }
    catch (error) {
        console.error('Error creating publisher:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.create = create;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publisherId = req.params.id;
        const publishers = yield publisher.update(req.body, {
            where: { id: publisherId },
        });
        if (publishers[0] === 1) {
            res.send({
                message: 'Publisher was updated successfully.',
            });
        }
        else {
            res.send({
                message: `Cannot update publisher with id=${publisherId}. Maybe publisher was not found or req.body is empty!`,
            });
        }
    }
    catch (error) {
        console.error('Error updating publisher:', error);
        res.status(500).send({
            message: 'Error updating Publisher.',
        });
    }
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publisherId = req.params.id;
        const Publisher = yield publisher.findByPk(Number(publisherId));
        if (!Publisher) {
            console.log('No Publisher with this id');
            res.status(404).json({ error: 'Publisher not found' });
            return;
        }
        const deletedPublisher = yield publisher.destroy({
            where: { id: Number(publisherId) },
        });
        res.json({ message: 'Publisher deleted successfully' });
    }
    catch (error) {
        if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(500).json({ error: 'Cannot delete this publisher because they published books' });
        }
        else {
            console.error('Error deleting publisher by id:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});
exports.remove = remove;
