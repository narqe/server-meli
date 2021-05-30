'use strict';

var CONFIG = {};

CONFIG.port = process.env.PORT || 4200;
CONFIG.cacheDuration = 60 * 60; 
CONFIG.backendCacheDuration = 10 * 60;
CONFIG.BASE_URL = process.env.BASE_URL || 'http://localhost:4200';

module.exports = CONFIG;
