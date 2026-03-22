import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

// Extendemos la interfaz Request para que reconozca "req.user"
export interface AuthRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export default function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const secret = process.env.JWT_SECRET || 'dev-secret';

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // attach user info to request
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}