import { Request, Response, NextFunction } from 'express';
import db from '../models';

const session = db.sessions;

const authorization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sessionFromHeader = req.get('session');

    // const { token } = req.body;

    const checkUser = await session.findOne({
      where: { session: sessionFromHeader },
    });

    if (!checkUser) {
       res.status(401).json({ error: 'Invalid session ' });
       return;
    }
    next();
  } catch (error) {
     res.status(401).json({ message: 'Unauthorized' });
  }
};

export default authorization;
