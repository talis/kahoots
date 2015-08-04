'use strict';

var should = require('should');
var config = require('../../config/environment');
var app = require('../../app');
var request = require('supertest');

var access_token = '24ad8108d87ce6348709e958b6e4cfd03c93c876';
var expired_token = '8755ee72c3468777ff628a9e0f0bf20d31281b33';
var user1 = 'fdgNy6QWGmIAl7BRjEsFtA';
var user2 = '4cxG2Zqk3r4YemcqV10SGA';
var fakeuser = '4cxG2Zqk3r4YemcqV10SGZ';
var clip1 = "55ba24f46a50e6033add8561";
var clip2 = "55ba24f46a50e6033add8562";
var clip3 = "55ba24f46a50e6033add8563";
var fakeclip = "55ba24f46a50e6033add8569";
var group3 = "55b690e7ac571fb05cef1a23";
var group2 = "55b690e7ac571fb05cef1a22";
var group1 = "55b690e7ac571fb05cef1a21";
var fakegroup = "55b690e7ac571fb05cef1a29";


/**
 * GET api/clips:id Test1 - access token invalid
 */
describe('GET api/clips/' + user1 + '?access_code='+expired_token, function(){
  it('should respond with a 401 - access code invalid', function(done){
    request(app)
      .get('/api/clips/' + user1 + '?access_code='+expired_token)
      .expect(401)
      .end(function(err, res){
        if (err!=null) throw err;
        done();
      })
  })
});
// Can't do this test because both persona accounts used for testing have 'su' scope
/*/!**
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
});*/
/**
 * GET api/clips/:id Test4 - should return with an array of 2 clips
 */
describe('GET api/clips/'+user1+'?access_token='+access_token, function(){
  it('should respond with an array length 2', function(done){
    request(app)
      .get('/api/clips/'+user1+'?access_token='+access_token)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        if (err) return done(err);
        res.body.should.have.length(2);
        done();
      })
  })
});
/**
 * GET api/clips/:id Test4 - should return with an array of 1 clips
 */
describe('GET api/clips/'+user2+'?access_token='+access_token, function(){
  it('should respond with an array length 1', function(done){
    request(app)
      .get('/api/clips/'+user2+'?access_token='+access_token)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        if (err) return done(err);
        res.body[0].should.have.property('name','dogface');
        done();
      })
  })
});
/**
 * POST api/clips/clip2/users/user2/comments {comment:comment} - invalid token
 */
describe('POST api/clips/'+clip2+'/users/'+user2+'/comments?access_token='+expired_token,function(){
  it('should respond with 401 unauthorized', function(done){
    request(app)
    .post('/api/clips/'+clip2+'/users/'+user2+'/comments?access_token='+expired_token)
      .type('form')
      .send( {comment:"hello"})
      .expect(401)
      .end(function(err, res) {
        if (err != null) throw err;
        done();
      });
  });
});
/**
 * POST api/clips/clip_id/users/user_id/comments {comment:comment} {comment:comment} - clip id doesnt exist 404
 */
describe('POST api/clips/'+fakeclip+'/users/'+user2+'/comments?access_token='+access_token,function(){
  it('should respond with 404 clip not found', function(done){
    request(app)
      .post('/api/clips/'+fakeclip+'/users/'+user2+'/comments?access_token='+access_token)
      .type('form')
      .send( {comment:"hello"})
      .expect(404)
      .end(function(err, res) {
        if (err != null) throw err;
        done();
      });
  });
});
/**
 * POST api/clips/clip_id/users/user_id/comments {comment:comment} - user id doesnt exist 404
 */
describe('POST api/clips/'+clip1+'/users/'+fakeuser+'/comments?access_token='+access_token,function(){
  it('should respond with 404 user not found', function(done){
    request(app)
      .post('/api/clips/'+clip1+'/users/'+fakeuser+'/comments?access_token='+access_token)
      .type('form')
      .send( {comment:"hello"})
      .expect(404)
      .end(function(err, res) {
        if (err != null) throw err;
        done();
      });
  });
});
/**
 * POST api/clips/clip_id/users/user_id/comments {comment:comment} - user id doesn't match author
 */
describe('POST api/clips/'+clip1+'/users/'+user2+'/comments?access_token='+access_token,function(){
  it('should respond with 401 user_id not author of clip', function(done){
    request(app)
      .post('/api/clips/'+clip1+'/users/'+user2+'/comments?access_token='+access_token)
      .type('form')
      .send( {comment:"hello"})
      .expect(401)
      .end(function(err, res) {
        if (err != null) throw err;
        done();
      });
  });
});
/**
 * POST api/clips/clip_id/users/user_id/comments {comment:comment} - check hasTarget correct
 */
describe('POST api/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token,function(){
  it('should respond with babel result hasTarget.uri[0]=clip_id', function(done){
    request(app)
      .post('/api/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token)
      .type('form')
      .send( {comment:"hello"})
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.hasTarget.uri[0].should.equal(clip1);
        done();
      });
  });
});
/**
 * POST api/clips/clip_id/users/user_id/comments {comment:comment} - check comment is correct
 */
describe('POST api/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token,function(){
  it('should respond with babel result hasBody.chars="hello', function(done){
    request(app)
      .post('/api/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token)
      .type('form')
      .send( {comment:"hello"})
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.hasBody.chars.should.equal("hello");
        done();
      });
  });
});
/**
* POST api/clips/clip_id/users/user_id/comments {comment:comment} - check firstname is saved
*/
describe('POST api/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token,function(){
  it('should respond with babel result hasBody.details.first_name = TN', function(done){
    request(app)
      .post('/api/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token)
      .type('form')
      .send( {comment:"hello"})
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.hasBody.details.first_name.should.equal("TN");
        done();
      });
  });
});
/**
 *  GET api/clips/:clip_id/users/:user_id/comments - expired token
 */
describe('GET api/clips/'+clip2+'/users/'+user2+'/comments?access_token='+expired_token,function(){
  it('should respond with 401 unauthorized', function(done){
    request(app)
      .get('/api/clips/'+clip2+'/users/'+user2+'/comments?access_token='+expired_token)
      .expect(401)
      .end(function(err, res) {
        if (err != null) throw err;
        done();
      });
  });
});
/**
 *  GET api/clips/:clip_id/users/:user_id/comments - fakeclip empty array
 */
describe('GET api/clips/'+fakeclip+'/users/'+user2+'/comments?access_token='+access_token,function(){
  it('should respond with empty array', function(done){
    request(app)
      .get('/api/clips/'+fakeclip+'/users/'+user2+'/comments?access_token='+access_token)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.annotations.should.have.length(0);
        done();
      });
  });
});
/**
 *  GET api/clips/:clip_id/users/:user_id/comments - fakeclip empty array
 */
describe('GET api/clips/'+clip2+'/users/'+user2+'/comments?access_token='+access_token,function(){
  it('should respond with comment in array', function(done){
    request(app)
      .post('/api/clips/'+clip2+'/users/'+user2+'/comments?access_token='+access_token)
      .type('form')
      .send( {comment:"hello"})
      .end(function(err,res){
        if(err) return done(err);
        request(app)
          .get('/api/clips/'+clip2+'/users/'+user2+'/comments?access_token='+access_token)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);
            res.body.annotations.should.not.have.length(0);
            done();
          });
      });
  });
});
