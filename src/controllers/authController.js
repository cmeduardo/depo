import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { authConfig } from '../config/env.js';

export const registerUser = async (req, res, next) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email: req.body.email,
      passwordHash,
      fullName: req.body.fullName,
      role: req.body.role
    });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ sub: user.id, role: user.role }, authConfig.jwtSecret, { expiresIn: authConfig.jwtExpiresIn });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
