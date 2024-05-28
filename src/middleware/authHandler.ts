import { Request, Response, NextFunction } from 'express';
import { findUserBySessionToken } from '../db/users';
import httpStatus from 'http-status';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const sessionToken = req.header('Session-Token') || '';
  if (sessionToken === '') {
    return res.status(httpStatus.UNAUTHORIZED).json(httpStatus['401_NAME']);
  }
  const user = await findUserBySessionToken(sessionToken);

  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json(httpStatus['401_NAME']);
  } else if (sessionToken !== user!.authentication!.sessionToken) {
    return res.status(httpStatus.UNAUTHORIZED).json(httpStatus['401_NAME']);
  }

  next();
};
