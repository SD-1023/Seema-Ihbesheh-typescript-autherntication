import { Request, Response } from 'express';
import db from '../models';

const publisher = db.publishers;

export const findAll = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!publisher) {
      throw new Error('Publisher model is undefined or null.');
    }

    const publishers = await publisher.findAll();
    console.log(publishers);
    res.json(publishers);
  } catch (error) {
    console.error('Error fetching all publishers:', (error as Error).message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
//to do: publishe/book
export const findByPk = async (req: Request, res: Response): Promise<void> => {
  try {
    const publisherId = req.params.id;

    // Check if publisherId is a valid integer
    if (isNaN(Number(publisherId)) || !Number.isInteger(parseFloat(publisherId))) {
      return ; // to do : res
    }

    const Publisher = await publisher.findByPk(Number(publisherId));
    if (!Publisher) {
      return;// to do : res
    }

    res.json(Publisher);
  } catch (error) {
    console.error('Error fetching Publisher:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const newPublisher = req.body;

    // Validate required fields
    if (!newPublisher.name) {
      res.status(400).json({ error: 'Name is required for a publisher' });
      return;
    }

    const publishers = await publisher.create(newPublisher);

    res.status(201).json(publishers);
  } catch (error) {
    console.error('Error creating publisher:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const publisherId = req.params.id;

    const publishers = await publisher.update(req.body, {
      where: { id: publisherId },
    });

    if (publishers[0] === 1) {
      res.send({
        message: 'Publisher was updated successfully.',
      });
    } else {
      res.send({
        message: `Cannot update publisher with id=${publisherId}. Maybe publisher was not found or req.body is empty!`,
      });
    }
  } catch (error) {
    console.error('Error updating publisher:', error);
    res.status(500).send({
      message: 'Error updating Publisher.',
    });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const publisherId = req.params.id;
    const Publisher = await publisher.findByPk(Number(publisherId));

    if (!Publisher) {
      console.log('No Publisher with this id');
      res.status(404).json({ error: 'Publisher not found' });
      return;
    }

    const deletedPublisher = await publisher.destroy({
      where: { id: Number(publisherId) },
    });

    res.json({ message: 'Publisher deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(500).json({ error: 'Cannot delete this publisher because they published books' });
    } else {
      console.error('Error deleting publisher by id:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
