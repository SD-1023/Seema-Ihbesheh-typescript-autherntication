import { Request, Response } from 'express';
import db from '../models';

const book = db.books;
const comment = db.comments;


export const findAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await book.findAll();
    console.log(books);
    res.json(books);
  } catch (error) {
    console.error('Error fetching all books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const findOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookId = req.params.id;

    if (isNaN(Number(bookId)) || !Number.isInteger(parseFloat(bookId))) {
      return;
    }

    const Book = await book.findOne({
      where: { id: Number(bookId) },
      include: [
        {
          model: db.publishers,
          // attributes: ['id', 'name'],
        },
        {
          model: db.comments,
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
    } else {
      res.status(404).json({ message: `Book id=${bookId} not found` });
    }
  } catch (error) {
    console.error('Error fetching Book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const newBook = req.body;

    if (!newBook.title || !newBook.isbn || !newBook.publisher_id) {
      res.status(400).json({ error: 'There are required fields missing' });
      return;
    }

    const books = await book.create(newBook);

    res.status(201).json(books);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
      console.error('Error creating book:', error);
      res.status(400).json({ error: 'ISBN must be unique' });
    } else if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
      console.error('Error creating book:', error);
      res.status(400).json({ error: 'publisher_id must exist' });
    } else {
      console.error('Error creating book:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookId = req.params.id;
    const books = await book.update(req.body, {
      where: { id: Number(bookId) },
    });

    if (books[0] === 1) {
      res.send({
        message: 'Book was updated successfully.',
      });
    } else {
      res.send({
        message: `Cannot update Book with id=${bookId}. Maybe Book was not found or req.body is empty!`,
      });
    }
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).send({
      message: 'Error updating Book.',
    });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookId = req.params.id;
    const Book = await book.findByPk(Number(bookId));

    if (!Book) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }

    const deletedComments = await comment.destroy({
      where: { book_id: Number(bookId) },
    });

    const deletedBook = await book.destroy({
      where: { id: Number(bookId) },
    });

    res.json({ message: `Book & Comments with id=${bookId} deleted successfully` });
  } catch (error) {
    console.error('Error deleting book by id:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const topRated = async (req: Request, res: Response): Promise<void> => {
  try {
    const topBooks = await comment.findAll({
      attributes: [
        'book_id',
        [db.sequelize.fn('avg', db.sequelize.col('comment.stars')), 'avgStars'],
      ],
      include: [
        {
          model: book,
        },
      ],
      group: ['comment.book_id'],
      order: [[db.sequelize.literal('avgStars'), 'DESC']],
      limit: 10,
    });

    res.json(topBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
