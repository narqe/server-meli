'use strict';
const app = require('./app');
const config = require('./config/global');

app.listen(config.port, () => {
  console.info(`Servidor corriendo en el puerto: ${config.port}`);
});
