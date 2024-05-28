import { Router } from 'express';
import { authorizationController } from '../controllers/authenticationController';

export default (router: Router) => {
	router.post('/login', authorizationController.login);
};
