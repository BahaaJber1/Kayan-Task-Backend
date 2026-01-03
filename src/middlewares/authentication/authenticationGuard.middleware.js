const authenticationGuard = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Unauthorized. Please sign in to access this resource.",
  });
};

export { authenticationGuard };
