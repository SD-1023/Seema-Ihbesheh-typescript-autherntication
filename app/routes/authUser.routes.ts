import  authorization from '../controllers/authorization';
import express, { Application } from 'express';


import * as users from '../controllers/authUser.controller';


    const router = express.Router();


    router.get('/auth', users.findAll);
    router.post('/auth-signup', users.signup);
    router.post('/auth-signin', users.signin);

    //router.use(authorization);
    router.post('/auth-change-password',authorization ,users.changePassword);
    router.post('/auth-logout',authorization,users.logout)


    const configureRoutes = (app: Application): void => {
        app.use('/api', router);
      };
export default configureRoutes;
