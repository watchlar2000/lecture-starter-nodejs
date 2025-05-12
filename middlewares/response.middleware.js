const responseMiddleware = (req, res, next) => {
  const { data } = res.locals;

  if (data?.error) {
    const statusCode = data.status || 500;
    return res.status(statusCode).json({
      ...data,
      message: data.message || 'Something went wrong',
    });
  }

  return res.status(200).json(data);
};

export { responseMiddleware };
