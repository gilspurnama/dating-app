import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authHandler';
import { userServices } from '../services/userService';

export default (router: Router) => {
  router.post('/users', userController.register);
  router.post('/users/dummy', userServices.populateDbWithUser);
  router.get('/users/:id', authMiddleware, userController.getUserById);
  router.patch('/users/:id', authMiddleware, userController.updateUser);
  router.get('/users/:id/preferred-users', authMiddleware, userController.getUserByPreferredGender);
  router.post('/users/:id/preferred-users', authMiddleware, userController.swipeAction);
  router.patch('/users/:id/subscriptions', authMiddleware, userController.updateSubscriptions);
};
