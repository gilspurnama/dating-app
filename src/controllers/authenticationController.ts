import { Request, Response } from 'express';
import { authorizationService } from '../services/authorizationService';
import { ErroHandler } from '../config/ErrorHandler';

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await authorizationService.userLogin(email, password);
    return res.status(200).json(data);
  } catch (error) {
    if (error instanceof ErroHandler) {
      return res.status(error.code).json(error.message);
    }
    logging.error(error);
    return res.status(400).json(error);
  }
};

export const authorizationController = {
  login
};
