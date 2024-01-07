import  authorization from '../controllers/authorization';

import express from 'express';
import { findAll, findByPk, create, remove } from '../controllers/comment.controller';

const router = express.Router();


//router.use(authorization);
router.get('/comment', findAll);
router.get('/comment/:id', findByPk);
router.post('/comment', create);
router.delete('/comment/:id', remove);

const setupCommentRoutes = (app: express.Application): void => {
  app.use('/api', router);
};

export default setupCommentRoutes;
