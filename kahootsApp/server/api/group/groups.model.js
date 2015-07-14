'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GroupsSchema = new Schema({
  name: String,
  info: String,
  creator: String
});

module.exports = mongoose.model('Groups', GroupsSchema);
