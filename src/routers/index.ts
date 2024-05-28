import { Router } from 'express';

import userRoutes from './userRoutes';
import authorizationRoutes from './authorizationRoutes';
import messageRoutes from './messageRoutes';

const router = Router();

export default (): Router => {
  userRoutes(router);
  messageRoutes(router);
  authorizationRoutes(router);

  return router;
};
