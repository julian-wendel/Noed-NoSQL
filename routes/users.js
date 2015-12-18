var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var Promise = require('bluebird');
var mongodb = require('mongodb').MongoClient;
var uuid = require('uuid');

var conStr = "mongodb://127.0.0.1:27017/nosql";

function connectToDB(req) {
    return new Promise(function (resolve, reject) {
        mongodb.connect(conStr, function (err, db) {
            if (err)
                reject({status: 500, err: err});
            else
                resolve({req: req, db: db});
        });
    });
}

function findAllUsers(args) {
    return new Promise(function (resolve, reject) {
        args.db.collection('users').find({}, {
            _id: 1,
            role: 1,
            username: 1,
            firstName: 1,
            name: 1
        }).toArray(function (err, res) {
            if (err)
                reject({status: 500, err: err});
            else
                resolve(res);
        });
    });
}

function findOneUser(args) {
    return new Promise(function (resolve, reject) {
        args.db.collection('users').find({username: args.req.params.userId}, {
            _id: 1,
            role: 1,
            username: 1,
            firstName: 1,
            name: 1
        }).toArray(function (err, res) {
            if (err || res.length == 0)
                reject({status: 404, err: err});
            else
                resolve(res[0]);
        });
    });
}

function createUserFromReq(args) {
    return new Promise(function (resolve, reject) {
        var user = {};
        user.username = args.req.body.username;
        user.name = args.req.body.name;
        user.firstName = args.req.body.firstName;
        user.password = args.req.body.password;
        user.role = args.req.body.role;

        args.user = user;
        if (!(user.username && user.name && user.firstName && user.password && user.role))
            reject({status: 400, err: new Error('Bad Request')});
        else
            resolve(args);
    });
}

function hashPassword(args) {
    return new Promise(function (resolve, reject) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) reject({status: 500, err: err});
            bcrypt.hash(args.user.password, salt, function (err, hash) {
                args.user.password = hash;

                if (err)
                    reject({status: 500, err: err});
                else
                    resolve(args);
            });
        });
    });
}

function storeUser(args) {
    args.user._id = uuid.v1();
    return new Promise(function (resolve, reject) {
        args.db.collection('users').insertOne(args.user, {}, function (err, result) {
            if (err)
                reject({status: 400, err: err});
            else
                resolve({db: args.db, user: result});
        });
    });
}

function addDefaultTasks(args) {
    console.log(args.user.ops[0]._id);
    var defaultTasks = [
        {
            "name": "Daily",
            "_id": uuid.v1(),
            "todos": [],
            "public": false,
            "owner": [args.user.ops[0]._id],
            "color": "lightblue"
        },
        {
            "name": "Private Backlog",
            "_id": uuid.v1(),
            "todos": [],
            "public": false,
            "owner": [args.user.ops[0]._id],
            "color": "lightblue"
        },
        {
            "name": "Work Backlog",
            "_id": uuid.v1(),
            "todos": [],
            "public": false,
            "owner": [args.user.ops[0]._id],
            "color": "lightblue"
        },
        {
            "name": "Shopping",
            "_id": uuid.v1(),
            "todos": [],
            "public": false,
            "owner": [args.user.ops[0]._id],
            "color": "lightblue"
        }];

    return new Promise(function (resolve, reject) {
        args.db.collection('tasks').insertMany(defaultTasks, function (err, result) {
            if (err)
                reject({status: 400, err: err});
            else
                resolve(result);
        });
    });
}

function updateUser(args) {
    return new Promise(function (resolve, reject) {
        args.db.collection('users').updateOne({username: args.req.params.userId}, {$set: args.user}, function (err, result) {
            if (err || result.modifiedCount == 0)
                reject({status: 400, err: err});
            else
                resolve(result);
        });
    });
}

function deleteUser(args) {
    return new Promise(function (resolve, reject) {
        args.db.collection('users').deleteOne({username: args.req.params.userId}, {}, function (err, result) {
            if (err || result.deletedCount == 0)
                reject({status: 400, err: err});
            else
                resolve(result);
        });
    });
}

/* GET users listing. */
router.get('/', function (req, res, next) {
    connectToDB(req)
        .then(findAllUsers)
        .then(function (users) {
            res.json(users);
        })
        .catch(function (err) {
            console.log(err);
            res.sendStatus(err.status);
        });
});

router.post('/', function (req, res, next) {
    connectToDB(req)
        .then(createUserFromReq)
        .then(hashPassword)
        .then(storeUser)
        .then(addDefaultTasks)
        .then(function (user) {
            res.json(user);
        })
        .catch(function (err) {
            console.log(err);
            res.sendStatus(err.status);
        });
});

router.get('/:userId', function (req, res, next) {
    connectToDB(req)
        .then(findOneUser)
        .then(function (user) {
            res.json(user);
        })
        .catch(function (err) {
            console.log(err);
            res.sendStatus(err.status);
        });
});

router.put('/:userId', function (req, res, next) {
    connectToDB(req)
        .then(createUserFromReq)
        .then(hashPassword)
        .then(updateUser)
        .then(function (user) {
            res.json(user);
        })
        .catch(function (err) {
            console.log(err);
            res.sendStatus(err.status);
        });
});

router.delete('/:userId', function (req, res, next) {
    connectToDB(req)
        .then(deleteUser)
        .then(function (user) {
            res.json(user);
        })
        .catch(function (err) {
            console.log(err);
            res.sendStatus(err.status);
        });
});

module.exports = router;
