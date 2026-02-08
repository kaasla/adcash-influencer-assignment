import { createApp } from './app.js';
import { env } from './config/env.js';
import { runStartup } from './startup.js';

const start = async () => {
  // Run startup tasks (db seed) in production
  if (env.NODE_ENV === 'production') {
    await runStartup();
  }

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  const shutdown = () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

start().catch((err: unknown) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
