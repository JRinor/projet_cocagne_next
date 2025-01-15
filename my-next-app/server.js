const express = require('express');
const next = require('next');
const { swaggerUi, specs } = require('./swagger');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Route pour la documentation Swagger
  server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  // Toutes les autres routes
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});