/**
 * Created by nico on 24.11.15.
 */

var express = require('express');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Promise = require('bluebird');
var mongodb = require('mongodb').MongoClient;
var router = express.Router();

var conStr = "mongodb://127.0.0.1:27017/nosql";
var privateKey = "Pass1234_";

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
        args.db.collection('users').find({username: args.req.body.username}).toArray(function getUser(err, users) {
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
            console.log('Passwords equal?' + result);
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
            //username: args.user.username,
			name: args.user.name,
			firstName: args.user.firstName,
            role: args.user.role
        }, privateKey, {expiresIn: "1h"}, function createToken(token) {
            resolve({token: token});
        });
    });
}

/* GET users listing. */
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
            console.log(error.err);
            res.sendStatus(error.status);
        });
});

module.exports = router;
