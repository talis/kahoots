'use strict';

var should = require('should');
var config = require('../../config/environment');
var app = require('../../app');
var request = require('supertest');
var nock = require('nock');



var user1 = 'fdgNy6QWGmIAl7BRjEsFtA';
var user2 = '4cxG2Zqk3r4YemcqV10SGA';
var fakeuser = '4cxG2Zqk3r4YemcqV10SGZ';
var clip1 = "55ba24f46a50e6033add8561";
var clip2 = "55ba24f46a50e6033add8562";
var clip3 = "55ba24f46a50e6033add8563";
var clip4 = "55ba24f46a50e6033add8564";
var clip5 = "55ba24f46a50e6033add8565";
var clip6 = "55ba24f46a50e6033add8566";
var fakeclip = "55ba24f46a50e6033add8569";
var group3 = "55b690e7ac571fb05cef1a23";
var group2 = "55b690e7ac571fb05cef1a22";
var group1 = "55b690e7ac571fb05cef1a21";
var group4 = "55b690e7ac571fb05cef1a24";
var group5 = "55b690e7ac571fb05cef1a25";
var group6 = "55b690e7ac571fb05cef1a26";
var fakegroup = "55b690e7ac571fb05cef1a29";
var testBabelResponse = {
  "hasBody":{
    "format":"text/plain",
    "type":"Text",
    "chars":"Hello",
    "details":{
      "first_name":"TN",
      "surname":"TestAccount",
      "email":"test.tn@talis.com"}
  },
  "hasTarget":{
    "uri":[
      "55b690e7ac571fb05cef1a23",
      "55ba24f46a50e6033add8561",
      "55b690e7ac571fb05cef1a23_55ba24f46a50e6033add8561"
    ]},
  "annotatedBy":"fdgNy6QWGmIAl7BRjEsFtA",
  "annotatedAt":1438872105016,
  "motivatedBy":"comment"
};

var token = "SECRET";
var expired_token = "BADSECRET";
// Allow supertest requests through
nock.enableNetConnect(/(127.0.0.1)/);
nock(config.oauth.scheme+'://'+config.oauth.host+':'+config.oauth.port)
  .head(config.oauth.route + "SECRET")
  .reply(204);
nock(config.oauth.scheme+'://'+config.babel.host+':'+config.babel.port)
  .post('/annotations')
  .reply(200,testBabelResponse);

describe('api/groups', function() {

  /**
   * POST api/groups/:group_id/clips/:clip_id/users/:user_id/comments
   * Post a new comment to a group clip.
   */
  describe('POST /api/groups/' + group3
    + '/clips/' + clip1
    + '/users/' + user1
    + '/comments', function () {
    /*it('should respond with 401 unauthorized', function (done) {
      request(app)
        .post('/api/groups/' + group3 + '/clips/' + clip1 + '/users/' + user1 + '/comments')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + expired_token)
        .send({something: 'here'})
        .expect(401)
        .end(function (err, res) {
          if (err != null) throw err;
          done();
        });
    }); */
    it('should respond with 400 bad request because no body', function (done) {
      request(app)
        .post('/api/groups/' + group3 + '/clips/' + clip1 + '/users/' + user1 + '/comments')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .send()
        .expect(400)
        .end(function (err, res) {
          if (err != null) throw err;
          done();
        });
    });

    it('should respond with 404 no group found', function (done) {
      request(app)
        .post('/api/groups/' + fakegroup + '/clips/' + clip1 + '/users/' + user1 + '/comments')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .send({comment: 'Hello'})
        .expect(404)
        .end(function (err, res) {
          if (err != null) throw err;
          done();
        });
    });

    it('should respond with 404 no clip found', function (done) {
      request(app)
        .post('/api/groups/' + group3 + '/clips/' + fakeclip + '/users/' + user1 + '/comments')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .send({comment: 'Hello'})
        .expect(404)
        .end(function (err, res) {
          if (err != null) throw err;
          done();
        });
    });

    it('should respond with 401 user not in group', function (done) {
      request(app)
        .post('/api/groups/' + group3 + '/clips/' + clip1 + '/users/' + user2 + '/comments')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .send({comment: 'Hello'})
        .expect(401)
        .end(function (err, res) {
          if (err != null) throw err;
          done();
        });
    });
    // These tests need a valid access token to use babel.
    /*it('should respond with babel result hasTarget= group_clip', function (done) {
      request(app)
        .post('/api/groups/' + group3 + '/clips/' + clip1 + '/users/' + user1 + '/comments')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .send({comment: 'Hello'})
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.hasTarget.uri[2].should.equal(group3 + '_' + clip1);
          done();
        });
    });

    it('should respond with babel result hasBody.chars = hello', function (done) {
      request(app)
        .post('/api/groups/' + group3 + '/clips/' + clip1 + '/users/' + user1 + '/comments')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .send({comment: 'Hello'})
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.hasBody.chars.should.equal("Hello");
          done();
        });
    });

    it('should respond with babel result hasBody.details.firstname = TN', function (done) {
      request(app)
        .post('/api/groups/' + group3 + '/clips/' + clip1 + '/users/' + user1 + '/comments')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .send({comment: 'Hello'})
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.hasBody.details.first_name.should.equal("TN");
          done();
        });
    });*/
  }); // end describe POST api/groups/:group_id/clips/:clips_id/users/:user_id/comment

  /**
  * GET api/groups/:group_id/clips/:clip_id/users/:user_id/comments
  */
  describe('GET /api/groups/' + group3 + '/clips/' + clip1 + '/users/' + user1 + '/comments', function () {

    it('should respond with empty list', function (done) {
      request(app)
        .get('/api/groups/' + fakegroup + '/clips/' + clip1 + '/users/' + user1 + '/comments')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(404)
        .end(function (err, res) {
          if (err != null) throw err;
          done();
        });
    });

  }); // end GET api/groups/:group_id/clips/:clip_id/users/:user_id/comments
}); // end describe api/groups
/*







    it('should respond with 401 user not group so is unauthorized', function (done) {
        request(app)
          .get('/api/groups/' + group3 + '/clips/' + clip1 + '/users/' + user2 + '/comments?access_token=' + access_token)
          .expect(401)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });
    it('should respond with array of annotations', function (done) {
        request(app)
          .get('/api/groups/' + group3 + '/clips/' + clip1 + '/users/' + user1 + '/comments?access_token=' + access_token)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.annotations.should.not.be.length(0);
            done();
          });
      });
    it('should respond with an empty array', function (done) {
        request(app)
          .get('/api/groups/' + group3 + '/clips/' + fakeclip + '/users/' + user1 + '/comments?access_token=' + access_token)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.annotations.should.be.length(0);
            done();
          });
      });
    });

    /!**
     *  POST api/groups/:group_id/users/:user_id/:email
     *!/
    describe('POST /api/groups/' + group4 + '/users/' + user1 + '/lauren.lewis@talis.com?access_token=' + expired_token, function () {
      it('should respond with 401 unauthorized', function (done) {
        request(app)
          .post('/api/groups/' + group4 + '/users/' + user1 + '/lauren.lewis@talis.com?access_token=' + expired_token)
          .expect(401)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });
    it('should respond with 404 group not found', function (done) {
        request(app)
          .post('/api/groups/' + fakegroup + '/users/' + user1 + '/lauren.lewis@talis.com?access_token=' + access_token)
          .expect(404)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });

   it('should respond with 401 user not in group, not authorized to add new user', function (done) {
        request(app)
          .post('/api/groups/' + group4 + '/users/' + user2 + '/lauren.lewis@talis.com?access_token=' + access_token)
          .expect(401)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });

   it('should respond with 404 email not found', function (done) {
        request(app)
          .post('/api/groups/' + group4 + '/users/' + user1 + '/alan@talis.com?access_token=' + access_token)
          .expect(404)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });
    it('should respond with 400 user already in group', function (done) {
        request(app)
          .post('/api/groups/' + group4 + '/users/' + user1 + '/test.tn@talis.com?access_token=' + access_token)
          .expect(400)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });
    it('should respond with group ', function (done) {
        request(app)
          .post('/api/groups/' + group4 + '/users/' + user1 + '/lauren.lewis@talis.com?access_token=' + access_token)
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            done();
          });
      });
    });

    /!**
     * POST /api/groups/:group_id/clips/:clip_id/:user_id - token expired
     *!/
    describe('POST /api/groups/' + group4 + '/clips/' + clip1 + '/' + user2 + '?access_token=' + expired_token, function () {
      it('should respond with 401 unauthorized', function (done) {
        request(app)
          .post('/api/groups/' + group4 + '/clips/' + clip1 + '/' + user2 + '?access_token=' + expired_token)
          .expect(401)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });
   it('should respond with 404 clip not found', function (done) {
        request(app)
          .post('/api/groups/' + group4 + '/clips/' + fakeclip + '/' + user2 + '?access_token=' + access_token)
          .expect(404)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });

   it('should respond with 401 not author of clip, not authorized', function (done) {
        request(app)
          .post('/api/groups/' + group4 + '/clips/' + clip1 + '/' + user1 + '?access_token=' + access_token)
          .expect(401)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });
    it('should respond with 400 clip already in group', function (done) {
        request(app)
          .post('/api/groups/' + group3 + '/clips/' + clip1 + '/' + user2 + '?access_token=' + access_token)
          .expect(400)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });
    it('should respond with 404 group doesnt exist', function (done) {
        request(app)
          .post('/api/groups/' + fakegroup + '/clips/' + clip1 + '/' + user2 + '?access_token=' + access_token)
          .expect(404)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });
   it('should respond with 404 group doesnt exist', function (done) {
        request(app)
          .post('/api/groups/' + group4 + '/clips/' + clip1 + '/' + user2 + '?access_token=' + access_token)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.clips.should.have.length(1);
            done();
          });
      });
    });

    /!**
     * GET /api/groups/:group_id/users/:user_id/clips - expired token
     *!/
    describe('GET /api/groups/' + group3 + '/users/' + user1 + '/clips?access_token=' + expired_token, function () {
      it('should respond with 401 unauthorized', function (done) {
        request(app)
          .get('/api/groups/' + group3 + '/users/' + user1 + '/clips?access_token=' + expired_token)
          .expect(401)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });
    it('should respond with 404 group not found', function (done) {
        request(app)
          .get('/api/groups/' + fakegroup + '/users/' + user1 + '/clips?access_token=' + access_token)
          .expect(404)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });
    it('should respond with 401 unauthorised, user not in group', function (done) {
        request(app)
          .get('/api/groups/' + group3 + '/users/' + user2 + '/clips?access_token=' + access_token)
          .expect(401)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });
    it('should respond with 200 and empty array', function (done) {
        request(app)
          .get('/api/groups/' + group2 + '/users/' + user1 + '/clips?access_token=' + access_token)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.should.have.length(0);
            done();
          });
      });
    it('should respond with 200 and array of clips', function (done) {
        request(app)
          .get('/api/groups/' + group3 + '/users/' + user1 + '/clips?access_token=' + access_token)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body[0].should.have.property('_id', clip1);
            done();
          });
      });
    it('should respond with 404 fake user', function (done) {
        request(app)
          .get('/api/groups/' + fakeuser + '?access_token=' + access_token)
          .expect(404)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });
   it('should respond with array of groups size 3', function (done) {
        request(app)
          .get('/api/groups/' + user1 + '?access_token=' + access_token)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.should.have.length(5);
            done();
          });
      });
    });

    /!**
     *  POST api/groups/:user_id - body does not have property name
     *!/
    describe('POST /api/groups/' + user1 + '?access_token=' + access_token, function () {
      it('should respond 400 body does not have correct properties', function (done) {
        request(app)
          .post('/api/groups/' + user1 + '?access_token=' + access_token)
          .type('form')
          .send({something: 'here'})
          .expect(400)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });
   it('should respond with new group with name given in body', function (done) {
        request(app)
          .post('/api/groups/' + user1 + '?access_token=' + access_token)
          .type('form')
          .send({name: 'Test Group WOW'})
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.should.have.property('name', 'Test Group WOW');
            done();
          });
      });
   it('should respond group with array of users containing user1_id', function (done) {
        request(app)
          .post('/api/groups/' + user1 + '?access_token=' + access_token)
          .type('form')
          .send({name: 'Test Group WOW'})
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.users[0].should.equal(user1);
            done();
          });
      });
  var newGroup = {};
      it('should respond group, group id should have been added to users list of groups', function (done) {
        request(app)
          .post('/api/groups/' + user1 + '?access_token=' + access_token)
          .type('form')
          .send({name: 'Test Group WOW'})
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            newGroup = res.body;
            request(app)
              .get('/api/users/' + user1 + '?access_token=' + access_token)
              .expect('Content-Type', /json/)
              .end(function (err, res) {
                if (err) return done(err);
                res.body.group[res.body.group.length - 1].should.equal(newGroup._id);
                done();
              });
          });
      });
    });

    /!**
     * DELETE api/groups/:group_id/users/:user_id - fake group
     *!/
    describe('DELETE /api/groups/' + fakegroup + '/users/' + user1 + '?access_token=' + access_token, function () {
      it('should respond 404 group does not exist', function (done) {
        request(app)
          .delete('/api/groups/' + fakegroup + '/users/' + user1 + '?access_token=' + access_token)
          .expect(404)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });
   it('should respond 404 user does not exist', function (done) {
        request(app)
          .delete('/api/groups/' + group5 + '/users/' + fakeuser + '?access_token=' + access_token)
          .expect(404)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });
    it('should respond 400 user not in group', function (done) {
        request(app)
          .delete('/api/groups/' + group5 + '/users/' + user2 + '?access_token=' + access_token)
          .expect(400)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });
    it('should respond 200 and user no longer in group users array', function (done) {
        request(app)
          .delete('/api/groups/' + group6 + '/users/' + user2 + '?access_token=' + access_token)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.users.should.have.length(1);
            res.body.users[0].should.not.equal(user2);
            done();
          });
      });
   it('should respond 204 group is deleted from database', function (done) {
        request(app)
          .delete('/api/groups/' + group5 + '/users/' + user1 + '?access_token=' + access_token)
          .expect(204)
          .end(function (err, res) {
            if (err) return done(err);
            done();
          });
      });
    });
    /!**
     * DELETE api/groups/:group_id/clips/:clip_id/users/:user_id
     *!/
    describe('DELETE /api/groups/' + group3 + '/clips/' + clip1 + '/users/' + fakeuser + '?access_token=' + access_token, function () {
      it('should respond 404 user does not exist', function (done) {
        request(app)
          .delete('/api/groups/' + group3 + '/clips/' + clip1 + '/users/' + fakeuser + '?access_token=' + access_token)
          .expect(404)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });
    it('should respond 401 use rnot in group, unauthorised', function (done) {
        request(app)
          .delete('/api/groups/' + group3 + '/clips/' + clip3 + '/users/' + user2 + '?access_token=' + access_token)
          .expect(401)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });


   it('should respond 404 clip not found', function (done) {
     request(app)
       .delete('/api/groups/' + group3 + '/clips/' + fakeclip + '/users/' + user1 + '?access_token=' + access_token)
       .expect(404)
       .end(function (err, res) {
         if (err != null) throw err;
         done();
       });
   });
    it('should respond 404 clip not in group', function (done) {
        request(app)
          .delete('/api/groups/' + group3 + '/clips/' + clip4 + '/users/' + user1 + '?access_token=' + access_token)
          .expect(404)
          .end(function (err, res) {
            if (err != null) throw err;
            done();
          });
      });
    });

});
    /!*
     * DELETE api/groups/:group_id/clips/:clip_id/users/:user_id - good request
     describe('DELETE /api/groups/'+group3+'/clips/'+clip5+'/users/'+ user1 +'?access_token='+access_token, function(){
     it('should respond group without clip in group', function(done){
     request(app)
     .delete('/api/groups/'+group3+'/clips/'+clip5+'/users/'+ user1 +'?access_token='+access_token)
     .expect('Content-Type', /json/)
     .end(function(err, res) {
     if (err) return done(err);
     for(var clip in res.body.clips){
     clip.should.not.equal(clip5);
     }
     done();
     });
     });
     });*!/

*/
