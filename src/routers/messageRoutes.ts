import { Router } from 'express';
import { authMiddleware } from '../middleware/authHandler';
import { messageController } from '../controllers/messageController';

export default (router: Router) => {
  router.post('/messages', authMiddleware, messageController.addMessage);
  router.get('/messages/from/:from/to/:to', authMiddleware, messageController.conversations);
};
