import { Request, Response } from 'express';
import db from '../models';

const comment = db.comments;


export const findAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const comments = await comment.findAll();
    res.json(comments);
  } catch (error) {
    console.error('Error fetching all comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const findByPk = async (req: Request, res: Response): Promise<void> => {
  try {
    const commentId = req.params.id;

    if (isNaN(Number(commentId)) || !Number.isInteger(parseFloat(commentId))) {
      return;
    }

    const Comment = await comment.findByPk(Number(commentId));

    res.json(Comment);
  } catch (error) {
    console.error('Error fetching Comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const newComment = req.body;

    // Validate required fields
    if (!newComment.name || !newComment.comment || !newComment.book_id) {
      res.status(400).json({ error: 'There are required fields missing' });
      return;
    }

    const comments = await comment.create(newComment);

    res.status(201).json(comments);
  }  catch (error: unknown) {
    if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
      console.error('Error creating comment:', error);
      res.status(400).json({ error: 'book_id must exist for book' });
    } else {
      console.error('Error creating comment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const commentId = req.params.id;
    const Comment = await comment.findByPk(commentId);

    if (!Comment) {
      console.log("No Comment with this id");
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    const deletedComment = await comment.destroy({
      where: { id: commentId },
    });

    res.json({ message: `Comment with id=${commentId} deleted successfully` });
  } catch (error) {
    console.error('Error deleting comment by id:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
