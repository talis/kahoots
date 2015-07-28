/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

//var Thing = require('../api/thing/thing.model');
var Clip = require('../api/clip/clip.model');
var Group = require('../api/group/group.model');
var User = require('../api/user/user.model');



Clip.find({}).remove(function() {
  Clip.create({
      content : 'http://pogogi.com/sites/default/files/field/image/square-watermelon.jpg',
      name    : 'Watermelon',
      source  : "http://news.bbc.co.uk/1/hi/world/asia-pacific/1390088.stm",
      comments: ["yummy","square melons!"],
      author  : "fdgNy6QWGmIAl7BRjEsFtA"
  }, {
      content : 'http://www.animalslook.com/img/cute/meet-cute-pygmy-hippos/meet-cute-pygmy-hippos01.jpg',
      name    : 'hippo',
      source  : "http://www.animalslook.com/meet-cute-pygmy-hippos/?f=1",
      comments: ["wow", "yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo" ],
      author  : "fdgNy6QWGmIAl7BRjEsFtA"

    },
    {
      content : 'http://www.cutestatus.com/wp-content/uploads/2015/06/cute-status-whatsapp-status-cool-status-nice-status.jpg',
      name    : 'bunny',
      source  :"http://justcuteanimals.com/wp-content/uploads/2014/03/cute-animal-pictures-tiny-bay-rabbit.jpg",
      comments: ["cute"],
      author  : "4cxG2Zqk3r4YemcqV10SGA"
    },
    {
      content : 'http://cretique.com/wp-content/uploads/2015/06/wonderful-food-art-ideas-for-cute-meals3.jpg',
      name    : 'cat soup',
      source  : "http://cretique.com/wonderful-food-art-ideas-for-cute-meals/",
      comments: ["woop"],
      author  : "4cxG2Zqk3r4YemcqV10SGA"
    }
  );
});


Group.remove({});
User.remove({});


