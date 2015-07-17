'use strict';

var express = require('express');
var controller = require('./clip.controller');

var router = express.Router();
var multer  = require('multer');


router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/mine/:id', controller.mine);
router.post('/', controller.create);
router.post('/file-upload/:id', [ multer({ }), controller.upload]);
router.post('/:clip_id/users/:user_id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
