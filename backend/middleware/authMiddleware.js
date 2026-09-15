import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fittrack_super_secret_jwt_key_2026';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found or deleted' });
    }
    // Exclude password
    const userObj = { ...user };
    delete userObj.password;
    req.user = userObj;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};
