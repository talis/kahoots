'use strict';

var express = require('express');
var controller = require('./group.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:user_id', controller.myGroups);
router.get('/:group_id/users/:user_id/clips', controller.getGroupClips());
router.post('/', controller.create);
router.post('/:user_id', controller.newGroup);
router.post('/:group_id/users/:other_user_id/:user_id', controller.addUser);
router.post('/:group_id/clips/:clip_id/:user_id', controller.addClip);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
