const hasRole = (...userRole) => {
  return (req, res, next) => {
    const { user } = req;
    if (user && userRole.includes(user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'You do not have the permission to perform this action' });
    }
  };
};

module.exports = hasRole;