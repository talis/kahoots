'use strict';

var express = require('express');
var controller = require('./env.controller');

var router = express.Router();


router.get('/config.js', controller.sendConfig);

module.exports = router;
