const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Verification
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({
        message: 'No authentication provided. Access denied.'
      });
    }

    // JWT verification
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(401).json({
        message: 'Token verification failed. Access denied.'
      });
    }
    req.user = { id: verified.id, role: verified.role };
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = auth;