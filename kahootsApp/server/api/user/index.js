'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

router.get('/', controller.index);
//router.get('/:id', controller.show);
router.get('/:id', controller.search);
router.post('/:id', controller.create);
router.put('/:id', controller.update);
// GET api/users/:user_id/feeds
router.get('/:user_id/feeds', controller.feed);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;
