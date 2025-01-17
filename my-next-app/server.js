const express = require('express');
const next = require('next');
const { serve, setup } = require('./swagger');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  // Middleware Swagger, accessible à /docs-api
  server.use('/docs-api', serve, setup);

  // Gestion des requêtes Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
    console.log(`> Swagger UI available at http://localhost:${PORT}/docs-api`);
  });
});