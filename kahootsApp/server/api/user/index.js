'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

//router.get('/', controller.index);
//router.get('/:id', controller.show);
router.get('/:id', controller.search);
router.post('/:id', controller.create);
router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;
