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
const publisher = db.publishers;
const Op = db.Sequelize.Op;
exports.findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.findByPk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publisher_Id = req.params.id;
        // Check if publisher_Id is a valid integer
        if (isNaN(publisher_Id) || !Number.isInteger(parseFloat(publisher_Id))) {
            return res.status(400).json({ error: 'Invalid ID. ID must be an integer.' });
        }
        const Publisher = yield publisher.findByPk(publisher_Id);
        if (!Publisher) {
            return res.status(404).json({ error: 'Publisher not found' });
        }
        res.json(Publisher);
    }
    catch (error) {
        console.error('Error fetching Publisher:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publisher_id = req.params.id;
        const publishers = yield publisher.update(req.body, {
            where: { id: publisher_id }
        })
            .then(affectedRowsCount => {
            if (affectedRowsCount == 1) {
                res.send({
                    message: "publisher was updated successfully."
                });
            }
            else {
                res.send({
                    message: `Cannot update publisher with id=${publisher_id}. Maybe publisher was not found or req.body is empty!`
                });
            }
        })
            .catch(err => {
            res.status(500).send({
                message: "Error updating Tutorial with id=" + publisher_id
            });
        });
    }
    catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publisher_Id = req.params.id;
        const Publisher = yield publisher.findByPk(publisher_Id);
        if (!Publisher) {
            console.log("no Publisher with this id");
            // res.json("no Publisher with this id");
            res.status(404).json({ error: 'Publisher not found' });
            return;
        }
        const deletedPublisher = yield publisher.destroy({
            where: { id: publisher_Id },
        });
        res.json({ message: 'Publisher deleted successfully' });
    }
    catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(500).json({ error: 'Can not delete this  publisher becouse he published books' });
        }
        else {
            console.error('Error deleting publisher by id:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});
