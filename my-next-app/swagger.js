const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Les Jardins de Cocagne API',
      version: '1.0.0',
      description: 'Documentation pour l\'API des Jardins de Cocagne',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Environnement de développement',
      },
    ],
  },
  // Mise à jour pour inclure tous les fichiers API
  apis: ['./src/pages/api/**/*.js'], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerSpec),
};