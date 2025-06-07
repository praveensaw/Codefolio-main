import jwt from 'jsonwebtoken'
export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the user information to the request
    next(); // Continue to the next middleware/route handler
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};


