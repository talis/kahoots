'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
   _id: String,
   first_name: String,
   surname: String,
   email: String,
   group: [String]
});

module.exports = mongoose.model('User', UserSchema);
