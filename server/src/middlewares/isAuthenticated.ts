import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ message: 'Unauthorized', success: false });
  }

  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized', success: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {

    console.log(error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token Expired', success: false });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid Token', success: false });
    } else {
      return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
  }
};

export { isAuthenticated };
