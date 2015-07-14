'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GroupClipSchema = new Schema({
  group_id: String,
  clip_id: String,
  chat: [{author:String, date:Date, comment:String}]
});

module.exports = mongoose.model('GroupClip', GroupClipSchema);
