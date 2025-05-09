export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      res.locals.data = {
        error: true,
        message: err.message,
      };
      next();
    });
  };
};
