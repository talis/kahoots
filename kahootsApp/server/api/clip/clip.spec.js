'use strict';

var should = require('should');
var config = require('../../config/environment');
var _getOAuthToken = require('../../components/shared/utils')._getOAuthToken;
var app = require('../../app');
var request = require('supertest');
var nock = require('nock');
var http = require('http');


var access_token = '8755ee72c3468777ff628a9e0f0bf20d31281b33';
var expired_token = '8755ee72c3468777ff628a9e0f0bf20d31281b33';
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
var fakegroup = "55b690e7ac571fb05cef1a29";
var api = null;

/*
describe('api/clips', function () {
  /!**
   * GET api/clips:id
   *!/
  describe('GET api/clips/' + user1 + '?access_code=' + access_token + ' - expired token', function () {
    it('THIS should respond with a 401 - access code invalid', function (done) {
     /!*var api = nock('http://localhost:9000')
       .get('/api/clips/fdgNy6QWGmIAl7BRjEsFtA?access_code=8755ee72c3468777ff628a9e0f0bf20d31281b33')
       .reply(200,{});*!/

      request(app)
        .get('/api/clips/' + user1 + '?access_code=' + access_token)
        .expect(401)
        .end(function (err, res) {
          if (err) done(err);
          done();
        });
    });
  });

  describe('GET api/clips/' + user1 + '?access_code=' + access_token + ' - valid token', function () {

// Can't do this test because both persona accounts used for testing have 'su' scope
    /!*!/!**
     * GET api/clips/:id Test3 - wrong access code for user
     *!/
     describe('GET api/clips/'+user1+'?access_token='+access_token, function(){
     it('should respond with 401 unauthorized', function(done){
     request(app)
     .get('/api/clips/'+user1+'?access_token='+access_token)
     .expect(401)
     .end(function(err, res){
     if (err!=null) throw err;
     done();
     })
     })
     });*!/

    it('should respond with a non empty array', function (done) {

      request(app)
        .get('/api/clips/' + user1 + '?access_token=' + access_token)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.should.not.have.length(0);
          done();
        });
    });

    it('should respond with an array with clip1 ', function (done) {
      request(app)
        .get('/api/clips/' + user2 + '?access_token=' + access_token)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          res.body[0].should.have.property('_id', clip1);
          done();
        });
    });
  });
  /!**
   * POST api/clips/clip2/users/user2/comments {comment:comment}
   *!/
  describe('POST api/clips/' + clip2 + '/users/' + user2 + '/comments?access_token=' + expired_token, function () {
    it('should respond with 401 unauthorized', function (done) {
      request(app)
        .post('/api/clips/' + clip2 + '/users/' + user2 + '/comments?access_token=' + expired_token)
        .type('form')
        .send({comment: "hello"})
        .expect(401)
        .end(function (err, res) {
          if (err != null) throw err;
          done();
        });
    });

    it('should respond with 404 clip not found', function (done) {
      request(app)
        .post('/api/clips/' + fakeclip + '/users/' + user2 + '/comments?access_token=' + access_token)
        .type('form')
        .send({comment: "hello"})
        .expect(404)
        .end(function (err, res) {
          if (err != null) throw err;
          done();
        });
    });

    it('should respond with 404 user not found', function (done) {
      request(app)
        .post('/api/clips/' + clip1 + '/users/' + fakeuser + '/comments?access_token=' + access_token)
        .type('form')
        .send({comment: "hello"})
        .expect(404)
        .end(function (err, res) {
          if (err != null) throw err;
          done();
        });
    });

    it('should respond with 401 user_id not author of clip', function (done) {
      request(app)
        .post('/api/clips/' + clip1 + '/users/' + user1 + '/comments?access_token=' + access_token)
        .type('form')
        .send({comment: "hello"})
        .expect(401)
        .end(function (err, res) {
          if (err != null) throw err;
          done();
        });
    });

    it('should respond with babel result hasTarget.uri[0]=clip_id', function (done) {
      request(app)
        .post('/api/clips/' + clip1 + '/users/' + user2 + '/comments?access_token=' + access_token)
        .type('form')
        .send({comment: "hello"})
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.hasTarget.uri[0].should.equal(clip1);
          done();
        });
    });

    it('should respond with babel result hasBody.chars="hello', function (done) {
      request(app)
        .post('/api/clips/' + clip1 + '/users/' + user2 + '/comments?access_token=' + access_token)
        .type('form')
        .send({comment: "hello"})
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.hasBody.chars.should.equal("hello");
          done();
        });
    });

    it('should respond with babel result hasBody.details.first_name = TN', function (done) {
      request(app)
        .post('/api/clips/' + clip1 + '/users/' + user2 + '/comments?access_token=' + access_token)
        .type('form')
        .send({comment: "hello"})
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.hasBody.details.first_name.should.equal("Lauren");
          done();
        });
    });
  });
  /!**
   *  GET api/clips/:clip_id/users/:user_id/comments
   *!/
  describe('GET api/clips/' + clip2 + '/users/' + user2 + '/comments?access_token=' + expired_token, function () {
    it('should respond with 401 unauthorized', function (done) {
      request(app)
        .get('/api/clips/' + clip2 + '/users/' + user2 + '/comments?access_token=' + expired_token)
        .expect(401)
        .end(function (err, res) {
          if (err != null) throw err;
          done();
        });
    });
    it('should respond with empty array', function (done) {
      request(app)
        .get('/api/clips/' + fakeclip + '/users/' + user2 + '/comments?access_token=' + access_token)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.annotations.should.have.length(0);
          done();
        });
    });
    it('should respond with comment in array', function (done) {
      request(app)
        .post('/api/clips/' + clip2 + '/users/' + user2 + '/comments?access_token=' + access_token)
        .type('form')
        .send({comment: "hello"})
        .end(function (err, res) {
          if (err) return done(err);
          request(app)
            .get('/api/clips/' + clip2 + '/users/' + user2 + '/comments?access_token=' + access_token)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
              if (err) return done(err);
              res.body.annotations.should.not.have.length(0);
              done();
            });
        });
    });
  });
  /!**
   * POST // POST api/clips/file-upload/:id
   *!/
  describe('POST api/clips/file-upload/' + user2 + '?access_token=' + expired_token, function () {
    it('should respond with 401 unauthorized', function (done) {
      request(app)
        .post('/api/clips/file-upload/' + user2 + '?access_token=' + expired_token)
        .type('form')
        .send({something: 'here'})
        .expect(401)
        .end(function (err, res) {
          if (err != null) throw err;
          done();
        });
    });
    it('should respond with 400 bad request', function (done) {
      request(app)
        .post('/api/clips/file-upload/' + user2 + '?access_token=' + access_token)
        .type('form')
        .send()
        .expect(400)
        .end(function (err, res) {
          if (err != null) throw err;
          done();
        });
    });
    it('should respond with 401 unauthorized', function (done) {
      request(app)
        .delete('/api/clips/' + clip2 + '/users/' + user2 + '?access_token=' + expired_token)
        .expect(401)
        .end(function (err, res) {
          if (err != null) throw err;
          done();
        });
    });
  });
  /!**
   * DELETE api/clips/:clip_id/users/:user_id
   *!/
  describe('DELETE api/clips/' + clip1 + '/users/' + user1 + '?access_token=' + access_token, function () {
    //this.timeout(15000);
    it('should respond with 401 user not owner of clip', function (done) {
      request(app)
        .delete('/api/clips/' + clip1 + '/users/' + user1 + '?access_token=' + access_token)
        .expect(401)
        .end(function (err, res) {
          if (err != null) throw err;
          done();
        });
    });
  });
  it('should respond with array of clip without clip 4', function (done) {
    request(app)
      .delete('/api/clips/' + clip4 + '/users/' + user1 + '?access_token=' + access_token)
      .end(function (err, res) {
        if (err) return done(err);
        request(app)
          .get('/api/clips/' + user1 + '?access_token=' + access_token)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            for (var clip in res.body) {
              clip.should.not.have.property('_id', clip4);
            }
            done();
          });
      });
  });
  it('should respond with list of clips without clip5', function (done) {
    request(app)
      .delete('/api/clips/' + clip5 + '/users/' + user1 + '?access_token=' + access_token)
      .end(function (err, res) {
        if (err) return done(err);
        request(app)
          .get('/api/groups/' + group1 + '/users/' + user1 + '/clips?access_token=' + access_token)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            for (var clip in res.body) {
              clip.should.not.have.property('_id', clip5);
            }
            done();
          });
      });
  });

});

*/
