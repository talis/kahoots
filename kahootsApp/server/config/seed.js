/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var Clip = require('../api/clip/clip.model');
var GroupClip = require('../api/group_clip/group_clip.model');
var GroupUser = require('../api/group_user/group_user.model');
var Group = require('../api/group/group.model');


Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

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
  ).then(addGroups());

});

var addGroups = function() {
  Group.find({}).remove(function () {
    Group.create({
        name: 'Test group1',
        info: 'Summer project test clips.'
      },
      {
        name: 'Test group2',
        info: 'Kahoots clips'
      }).then(GroupUserClips());
  });
};

// Add users to group 1
var GroupUserClips = function(){
GroupClip.find({}).remove(function() {
  GroupUser.find({}).remove(function () {
    Group.find()
      .where('name')
      .in(['Test group1'])
      .exec(function (err, group) {
        GroupUser.create({
          group_id: group[0]._id,
          user_id: "4cxG2Zqk3r4YemcqV10SGA"
        }, {
          group_id: group[0]._id,
          user_id: "fdgNy6QWGmIAl7BRjEsFtA"
        });
        // clip 2
        Clip.find()
          .where('name')
          .in(['hippo'])
          .exec(function (err, clip) {
            GroupClip.create({
              group_id: group[0]._id,
              clip_id: clip[0]._id
            })
          });
        // clip 1
        Clip.find()
          .where('name')
          .in(['cat soup'])
          .exec(function (err, clip) {
            GroupClip.create({
              group_id: group[0]._id,
              clip_id: clip[0]._id
            })
          });
      });

// Add a user and clips to group 2
    Group.find()
      .where('name')
      .in(['Test group2'])
      .exec(function (err, group) {
        //users
        GroupUser.create({
          group_id: group[0]._id,
          user_id: "4cxG2Zqk3r4YemcqV10SGA"
        });
        // clip 1
        Clip.find()
          .where('name')
          .in(['Watermelon'])
          .exec(function (err, clip) {
            GroupClip.create({
              group_id: group[0]._id,
              clip_id: clip[0]._id
            })
          });
        // clip 3
        Clip.find()
          .where('name')
          .in(['bunny'])
          .exec(function (err, clip) {
            GroupClip.create({
              group_id: group[0]._id,
              clip_id: clip[0]._id
            })
          });
      });
  });
});
};
