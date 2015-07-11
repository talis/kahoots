'use strict';

var express = require('express');
var controller = require('./clip.controller');

var router = express.Router();
var multer  = require('multer');


router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/mine/:id', controller.mine);
router.post('/', controller.create);
router.post('/file-upload/', [ multer({ }), controller.upload]);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
