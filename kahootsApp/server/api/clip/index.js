'use strict';

var express = require('express');
var controller = require('./clip.controller');

var router = express.Router();
var multer  = require('multer');


/*router.get('/', controller.index);
router.get('/:id', controller.show);*/
// GET api/clips/:clip_id/users/:user_id/comments
router.get('/:clip_id/users/:user_id/comments', controller.getComments);
router.get('/:id', controller.userClips);
router.post('/:clip_id/users/:user_id/comments', controller.addComment);
//router.post('/', controller.create);
router.post('/file-upload/:id', [ multer({ }), controller.upload]);
//router.post('/:clip_id/users/:user_id', controller.update);
router.delete('/:clip_id/users/:user_id', controller.destroyClip);
//router.delete('/:id', controller.destroy);

module.exports = router;
