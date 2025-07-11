const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret';

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = decoded; // { userId, role }
    next();
  });
};

module.exports = authenticate;
