export const notFound = (req, res, next) => {
  const err = new Error(`Not Found - ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Server Error";
  const stack = process.env.NODE_ENV === "production" ? undefined : err.stack;
  res.status(status).json({ success: false, message, stack });
};
