// Minimal entry file for Elastic Beanstalk / Procfile
// It loads .env if available and starts the compiled NestJS app in `dist/main.js`.
try { require('dotenv').config(); } catch (e) { /* ignore if dotenv not installed */ }
try {
  // dist/main.js should bootstrap the Nest app when required/run
  require('./dist/main.js');
} catch (err) {
  // If running in source mode (no build), print helpful message
  console.error('Failed to start application from dist/main.js. Have you run `npm run build`?');
  console.error(err && (err.stack || err));
  process.exit(1);
}
