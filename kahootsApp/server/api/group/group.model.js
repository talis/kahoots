'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GroupSchema = new Schema({
  name: String,
  description: String,
  chat: [Schema.Types.Mixed],
  users: [String],
  clips: [String]
});

module.exports = mongoose.model('Group', GroupSchema);
