import  authorization from '../controllers/authorization';
import express, { Application } from 'express';
import { findAll, findOne, create, update, remove, topRated } from '../controllers/book.controller';

const router = express.Router();


//router.use(authorization);
router.get('/book', findAll);
router.get('/book/:id', findOne);
router.post('/book', create);
router.put('/book/:id', update);
router.delete('/book/:id', remove);
router.get('/books/topRated', topRated);

const configureRoutes = (app: Application): void => {
  app.use('/api', router);
};

export default configureRoutes;
