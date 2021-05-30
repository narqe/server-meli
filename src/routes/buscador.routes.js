'use strict';
const express = require('express');
const api = express.Router();
const controller = require('../controllers/buscador.controller');

api.get('/detalles/:id', controller.getDetails);
api.get('/productos/:term', controller.getResults);

module.exports = api;