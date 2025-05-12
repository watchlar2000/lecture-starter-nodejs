function gracefulShutdown(server) {
  console.log('Server is shutting down');
  server.close(() => {
    console.log('Server closed successfully');
    process.exit(0);
  });
}

export { gracefulShutdown };
