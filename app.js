try { require('dotenv').config(); } catch (e) { /* ignore if dotenv not installed */ }
try {
  require('./dist/main.js');
} catch (err) {

  console.error('Failed to start application from dist/main.js. Have you run `npm run build`?');
  console.error(err && (err.stack || err));
  process.exit(1);
}
