'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const correlator = require('express-correlation-id');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();
var request = require('request');
const CONF = require('./config/global');
const requestIp = require('request-ip');
const routes = require('./routes/buscador.routes');

// Load environment variables from .env
var dotenv = require('dotenv');
dotenv.config();

app.use('/swagger-ui.html', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors({ origin: true, credentials: true }));
app.use(correlator({ header: 'x-correlation-id' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
// Morgan is a library to log, the format is the combined plus header x-correlation-id.
app.use(morgan('[AUDIT] remote-addr=:remote-addr - remote-user=:remote-user date=[:date[iso]] method=:method ' +
  'url=:url HTTP/:http-version status=:status response-content-length=:res[content-length] ' +
  'referer=:referrer user-agent=:user-agent x-correlation-id=:res[x-correlation-id]'));
app.use((req, res, next) => {
  let correlatorId = req.correlationId() || correlator.getId();
  let ip = requestIp.getClientIp(req);

  req.headers['x-correlation-id'] = correlatorId;
  res.header('x-correlation-id', correlatorId);

  req.headers['client-ip'] = ip;
  res.header('client-ip', ip);

  res.setHeader('Content-Type', 'application/json');

  next();
});

app.set('trust proxy', function(ip) {
  return true;
});

app.use(routes);

module.exports = app;
