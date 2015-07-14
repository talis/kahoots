'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GroupUserSchema = new Schema({
  group_id: String,
  user_id: String,
  role: String
});

module.exports = mongoose.model('GroupUser', GroupUserSchema);
