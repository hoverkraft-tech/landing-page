process.on('unhandledRejection', (reason) => {
  // Vitest sometimes prints only "[object Object]"; log the real payload.
  // eslint-disable-next-line no-console
  console.error('[unhandledRejection]', reason);
});

process.on('uncaughtException', (error) => {
  // eslint-disable-next-line no-console
  console.error('[uncaughtException]', error);
});
