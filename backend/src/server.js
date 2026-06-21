/**
 * HTTP server bootstrap. Loads env, starts Express, and wires graceful shutdown.
 */
import 'dotenv/config';
import app from './app.js';
import prisma from './config/db.js';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Car Japan API running on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

// Graceful shutdown — close the HTTP server and Prisma pool cleanly.
async function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down…`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
