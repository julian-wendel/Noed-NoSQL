/**
 * Created by nico on 24.11.15.
 */

var express = require('express');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var async = require('async');
var mongodb = require('mongodb').MongoClient;
var router = express.Router();

var conStr = "mongodb://127.0.0.1:27017/nosql";
var privateKey = "Pass1234_";

function connectToDB(req, callback){
    mongodb.connect(conStr, function connectToDB(err, db) {
        if (err) {
            console.log(err);
           return callback({status: 500, message: 'Could not connect to DB.'});
        }

        callback(null, req, db);
    });
}

function findUser(req, db, callback){
    db.collection('users').find({username: req.body.username}).toArray(function getUser(err, users) {
        if (err){
            console.log(err);
            db.close();
            return callback({status: 500, message: 'Could not find User'});
        }

        console.log(users);
        db.close();
        callback(null, req, users);
    });
}

function comparePassword(req, users, callback){
    bcrypt.compare(req.body.password, users[0].password, function comparePassword(err, result){
        if(err || !result){
            callback({status: 405, message: 'Passwords are not equal.'});
        }

        callback(null, users[0]);
    });
}

function createToken(user, callback){
    console.log(user);
    jwt.sign({id: user._id, username: user.username, role: user.role}, privateKey, { expiresIn: "1h"}, function createToken(token){
        callback(null, token);
    });
}

/* GET users listing. */
router.post('/', function(req, res) {
    var userReq = req.body;
    if(!(userReq.username && userReq.password)){
        res.sendStatus(400);
        return;
    }

    async.waterfall([
        connectToDB.bind(this, req),
        findUser,
        comparePassword,
        createToken
    ], function(err, token){
        if(err)
            return res.sendStatus(err.status);

        res.json({token: token});
    });
});

module.exports = router;
