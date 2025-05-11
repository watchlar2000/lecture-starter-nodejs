export const writeToResponseLocals = (res) => ({
  setData(data) {
    res.locals.data = data;
  },
  setError({ status = 500, message }) {
    res.locals.data = {
      error: true,
      status,
      message,
    };
  },
});
