/**
 * HTTP server bootstrap. Loads env, starts Express, and wires graceful shutdown.
 */

import 'dotenv/config';
import app from './app.js';
import prisma from './config/db.js';
import { ensureSchema } from './config/ensureSchema.js';

const PORT = process.env.PORT || 5000;

let server;

async function start() {
  try {
    await ensureSchema();
  } catch (err) {
    console.error('Schema bootstrap warning:', err.message);
  }

  server = app.listen(PORT, () => {
    console.log(
      `🚀 Car Japan API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`
    );
  });
}

await start();

// Graceful shutdown (Render safe)
async function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log('Prisma disconnected');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });
}

// Handle termination signals (Render / Linux servers)
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Handle unexpected errors (prevents silent crashes)
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});