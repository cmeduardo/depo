import jwt from 'jsonwebtoken';
import { authConfig } from '../config/env.js';
import { User } from '../models/index.js';

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, authConfig.jwtSecret);
    const user = await User.findByPk(decoded.sub);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid user' });
    }
    req.user = { id: user.id, role: user.role, email: user.email };
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorize = (roles = []) => (req, res, next) => {
  if (!roles.length || roles.includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden' });
};
