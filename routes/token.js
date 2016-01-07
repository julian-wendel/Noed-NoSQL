/**
 * Created by nico on 24.11.15.
 */

var express = require('express');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Promise = require('bluebird');
var mongodb = require('mongodb').MongoClient;
var router = express.Router();
var config = require('../settings');

var conStr = "mongodb://" + config.mongodb.host + ":" + config.mongodb.port + "/" + config.mongodb.database;
var usersName = config.mongodb.collections.users;
var tokenKey = config.security.tokenKey;

function connectToDB(req){
    return new Promise(function(resolve, reject) {
        mongodb.connect(conStr, function connectToDB(err, db) {
            if (err)
                reject({status: 500, err: err});
            else
                resolve({req: req, db: db});
        });
    });
}

function findUser(args){
    return new Promise(function(resolve, reject){
        args.db.collection(usersName).find({username: args.req.body.username}).toArray(function getUser(err, users) {
            if (err)
                reject({status: 400, err: err});
            else
                resolve({req: args.req, users: users});

        });
    });
}

function comparePassword(args){
    return new Promise(function(resolve, reject) {
        bcrypt.compare(args.req.body.password, args.users[0].password, function comparePassword(err, result) {
            if (err || !result)
                reject({status: 400, err: err});
            else
                resolve({user: args.users[0]});
        });
    });
}

function createToken(args){
    return new Promise(function (resolve, reject) {
        jwt.sign({
            id: args.user._id,
			name: args.user.name,
			firstName: args.user.firstName,
            role: args.user.role
        }, tokenKey, {expiresIn: "1h"}, function createToken(token) {
            resolve({token: token});
        });
    });
}

/**
 * @api {post} /api/token Generate
 * @apiName GetToken
 * @apiGroup Token
 *
 * @apiParam {String} username username of user
 * @apiParam {String} password (new) password password of user
 * @apiParamExample {json} Request-Example:
 *     {
 *       "username": "max",
 *       "password": "mustermann"
 *     }
 *
 * @apiSuccess {String} token token of user
 * @apiSuccessExample {json} Response-Example:
 *      {
 *          "token": "xyzszzdausdaksd.dsdsd....."
 *      }
 *
 * @apiError BadRequest username or password missing or invalid
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.post('/', function(req, res) {
    var userReq = req.body;
    if(!(userReq.username && userReq.password)){
        res.sendStatus(400);
        return;
    }

    connectToDB(req)
        .then(findUser)
        .then(comparePassword)
        .then(createToken)
        .then(function(data){
            res.json(data);
        })
        .catch(function(error){
            console.log(error);
            res.sendStatus(error);
        });
});

module.exports = router;
