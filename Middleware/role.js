// ─── Role Authorization Middleware ────────────────────────────────────────────
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

export default authorizeRoles;