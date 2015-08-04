'use strict';

var should = require('should');
var config = require('../../config/environment');
var app = require('../../app');
var request = require('supertest');

var access_token = config.access_token;
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
var group4 = "55b690e7ac571fb05cef1a24";
var fakegroup = "55b690e7ac571fb05cef1a29";


/*describe('GET /api/groups', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/groups')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});*/

/**
 * POST api/groups/:group_id/clips/:clip_id/users/:user_id/comments - expired token
 * Post a new comment to a group clip.
 */
describe('POST /api/groups/'+group3+'/clips/'+clip1+'/users/'+user1+'/comments?access_token='+expired_token, function(){
it('should respond with 401 unauthorized', function(done){
  request(app)
    .post('/api/groups/'+group3+'/clips/'+clip1+'/users/'+user1+'/comments?access_token='+expired_token)
    .type('form')
    .send({something:'here'})
    .expect(401)
    .end(function(err, res) {
      if (err != null) throw err;
      done();
    });
  });
});
/**
 * POST api/groups/:group_id/clips/:clip_id/users/:user_id/comments - no body
 * Post a new comment to a group clip.
 */
describe('POST /api/groups/'+group3+'/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token, function(){
  it('should respond with 400 bad request because no body', function(done){
    request(app)
      .post('/api/groups/'+group3+'/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token)
      .type('form')
      .send()
      .expect(400)
      .end(function(err, res) {
        if (err != null) throw err;
        done();
      });
  });
});
/**
 * POST api/groups/:group_id/clips/:clip_id/users/:user_id/comments - fake group
 * Post a new comment to a group clip.
 */
describe('POST /api/groups/'+fakegroup+'/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token, function(){
  it('should respond with 404 no group found', function(done){
    request(app)
      .post('/api/groups/'+fakegroup+'/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token)
      .type('form')
      .send({comment:'Hello'})
      .expect(404)
      .end(function(err, res) {
        if (err != null) throw err;
        done();
      });
  });
});
/**
 * POST api/groups/:group_id/clips/:clip_id/users/:user_id/comments - fake clip
 * Post a new comment to a group clip.
 */
describe('POST /api/groups/'+group3+'/clips/'+fakeclip+'/users/'+user1+'/comments?access_token='+access_token, function(){
  it('should respond with 404 no clip found', function(done){
    request(app)
      .post('/api/groups/'+group3+'/clips/'+fakeclip+'/users/'+user1+'/comments?access_token='+access_token)
      .type('form')
      .send({comment:'Hello'})
      .expect(404)
      .end(function(err, res) {
        if (err != null) throw err;
        done();
      });
  });
});
/**
 * POST api/groups/:group_id/clips/:clip_id/users/:user_id/comments - user not in group
 * Post a new comment to a group clip.
 */
describe('POST /api/groups/'+group3+'/clips/'+clip1+'/users/'+user2+'/comments?access_token='+access_token, function(){
  it('should respond with 401 user not in group', function(done){
    request(app)
      .post('/api/groups/'+group3+'/clips/'+clip1+'/users/'+user2+'/comments?access_token='+access_token)
      .type('form')
      .send({comment:'Hello'})
      .expect(401)
      .end(function(err, res) {
        if (err != null) throw err;
        done();
      });
  });
});
/**
 * POST api/groups/:group_id/clips/:clip_id/users/:user_id/comments - user not in group
 * Post a new comment to a group clip.
 */
describe('POST /api/groups/'+group3+'/clips/'+clip1+'/users/'+user2+'/comments?access_token='+access_token, function(){
  it('should respond with 401 user not in group', function(done){
    request(app)
      .post('/api/groups/'+group3+'/clips/'+clip1+'/users/'+user2+'/comments?access_token='+access_token)
      .type('form')
      .send({comment:'Hello'})
      .expect(401)
      .end(function(err, res) {
        if (err != null) throw err;
        done();
      });
  });
});
/**
 * POST api/groups/:group_id/clips/:clip_id/users/:user_id/comments - checking hasTarget correct
 * Post a new comment to a group clip.
 */
describe('POST /api/groups/'+group3+'/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token, function(){
  it('should respond with babel result hasTarget= group_clip', function(done){
    request(app)
      .post('/api/groups/'+group3+'/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token)
      .type('form')
      .send({comment:'Hello'})
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.hasTarget.uri[2].should.equal(group3+'_'+clip1);
        done();
      });
  });
});
/**
 * POST api/groups/:group_id/clips/:clip_id/users/:user_id/comments - checking chars
 * Post a new comment to a group clip.
 */
describe('POST /api/groups/'+group3+'/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token, function(){
  it('should respond with babel result hasBody.chars = hello', function(done){
    request(app)
      .post('/api/groups/'+group3+'/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token)
      .type('form')
      .send({comment:'Hello'})
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.hasBody.chars.should.equal("Hello");
        done();
      });
  });
});
/**
 * POST api/groups/:group_id/clips/:clip_id/users/:user_id/comments - checking username
 * Post a new comment to a group clip.
 */
describe('POST /api/groups/'+group3+'/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token, function(){
  it('should respond with babel result hasBody.details.firstname = TN', function(done){
    request(app)
      .post('/api/groups/'+group3+'/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token)
      .type('form')
      .send({comment:'Hello'})
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.hasBody.details.first_name.should.equal("TN");
        done();
      });
  });
});


/**
 * GET api/groups/:group_id/clips/:clip_id/users/:user_id/comments - expired token
 */
describe('GET /api/groups/'+group3+'/clips/'+clip1+'/users/'+user1+'/comments?access_token='+expired_token, function(){
  it('should respond with 401 unauthorized', function(done){
    request(app)
      .get('/api/groups/'+group3+'/clips/'+clip1+'/users/'+user1+'/comments?access_token='+expired_token)
      .expect(401)
      .end(function(err, res) {
        if (err != null) throw err;
        done();
      });
  });
});
/**
 * GET api/groups/:group_id/clips/:clip_id/users/:user_id/comments - fake group
 */
describe('GET /api/groups/'+fakegroup+'/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token, function(){
  it('should respond with empty list', function(done){
    request(app)
      .get('/api/groups/'+fakegroup+'/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token)
      .expect(404)
      .end(function(err, res) {
        if (err != null) throw err;
        done();
      });
  });
});
/**
 * GET api/groups/:group_id/clips/:clip_id/users/:user_id/comments - user not in group
 */
describe('GET /api/groups/'+group3+'/clips/'+clip1+'/users/'+user2+'/comments?access_token='+access_token, function(){
  it('should respond with 401 user not group so is unauthorized', function(done){
    request(app)
      .get('/api/groups/'+group3+'/clips/'+clip1+'/users/'+user2+'/comments?access_token='+access_token)
      .expect(401)
      .end(function(err, res) {
        if (err != null) throw err;
        done();
      });
  });
});
/**
 * GET api/groups/:group_id/clips/:clip_id/users/:user_id/comments - good
 */
describe('GET/api/groups/'+group3+'/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token, function(){
  it('should respond with array of annotations', function(done){
    request(app)
      .get('/api/groups/'+group3+'/clips/'+clip1+'/users/'+user1+'/comments?access_token='+access_token)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.annotations.should.not.be.length(0);
        done();
      });
  });
});
/**
 * GET api/groups/:group_id/clips/:clip_id/users/:user_id/comments - fake clip
 */
describe('GET /api/groups/'+group3+'/clips/'+fakeclip+'/users/'+user1+'/comments?access_token='+access_token, function(){
  it('should respond with an empty array', function(done){
    request(app)
      .get('/api/groups/'+group3+'/clips/'+fakeclip+'/users/'+user1+'/comments?access_token='+access_token)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.annotations.should.be.length(0);
        done();
      });
  });
});

/**
 *  POST api/groups/:group_id/users/:user_id/:email - expired token
 */
describe('POST /api/groups/'+group4+'/users/'+user1+'/lauren.lewis@talis.com?access_token='+expired_token, function(){
  it('should respond with 401 unauthorized', function(done){
    request(app)
      .post('/api/groups/'+group4+'/users/'+user1+'/lauren.lewis@talis.com?access_token='+expired_token)
      .expect(401)
      .end(function(err, res) {
        if (err != null) throw err;
        done();
      });
  });
});
/**
 *  POST api/groups/:group_id/users/:user_id/:email - fake group 404
 */
describe('POST /api/groups/'+fakegroup+'/users/'+user1+'/lauren.lewis@talis.com?access_token='+access_token, function(){
  it('should respond with 404 group not found', function(done){
    request(app)
      .post('/api/groups/'+fakegroup+'/users/'+user1+'/lauren.lewis@talis.com?access_token='+access_token)
      .expect(404)
      .end(function(err, res) {
        if (err != null) throw err;
        done();
      });
  });
});
/**
 *  POST api/groups/:group_id/users/:user_id/:email - user not in group
 */
describe('POST /api/groups/'+group4+'/users/'+user2+'/lauren.lewis@talis.com?access_token='+access_token, function(){
  it('should respond with 401 user not in group, not authorized to add new user', function(done){
    request(app)
      .post('/api/groups/'+group4+'/users/'+user2+'/lauren.lewis@talis.com?access_token='+access_token)
      .expect(401)
      .end(function(err, res) {
        if (err != null) throw err;
        done();
      });
  });
});
/**
 *  POST api/groups/:group_id/users/:user_id/:email - email does not belong to kahoots user
 */
describe('POST /api/groups/'+group4+'/users/'+user1+'/alan@talis.com?access_token='+access_token, function(){
  it('should respond with 404 email not found', function(done){
    request(app)
      .post('/api/groups/'+group4+'/users/'+user1+'/alan@talis.com?access_token='+access_token)
      .expect(404)
      .end(function(err, res) {
        if (err != null) throw err;
        done();
      });
  });
});
/**
 *  POST api/groups/:group_id/users/:user_id/:email - user already in group
 */
describe('POST /api/groups/'+group4+'/users/'+user1+'/tn.test@talis.com?access_token='+access_token, function(){
  it('should respond with 400 user already in group', function(done){
    request(app)
      .post('/api/groups/'+group4+'/users/'+user1+'/test.tn@talis.com?access_token='+access_token)
      .expect(400)
      .end(function(err, res) {
        if (err != null) throw err;
        done();
      });
  });
});
/**
 *  POST api/groups/:group_id/users/:user_id/:email - good
 */
describe('POST /api/groups/'+group4+'/users/'+user1+'/lauren.lewis@talis.com?access_token='+access_token, function(){
  it('should respond with group ', function(done){
    request(app)
      .post('/api/groups/'+group4+'/users/'+user1+'/lauren.lewis@talis.com?access_token='+access_token)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});
