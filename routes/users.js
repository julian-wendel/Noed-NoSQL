var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var Promise = require('bluebird');
var mongodb = require('mongodb').MongoClient;
var uuid = require('uuid');
var config = require('../settings');

var conStr = "mongodb://" + config.mongodb.host + ":" + config.mongodb.port + "/" + config.mongodb.database;
var usersName = config.mongodb.collections.users;

(function addDefaultUsers() {
    var defaultUsers = [
		{
			_id: 1,
			username: 'admin',
			password: 'admin',
			role: 'ADMIN',
			name: 'Istrator',
			firstName: 'Admin'
		},
        {
            _id: 2,
            username: 'test',
            password: 'admin',
            role: 'USER',
            name: 'Kraus',
            firstName: 'Martina'
        }
	];

    for(var index in defaultUsers){
        var req = {};
        req.body = defaultUsers[index];

        connectToDB(req)
            .then(createUserFromReq)
            .then(hashPassword)
            .then(storeUser)
            .catch(function (err) {
                console.log(err);
            });
    }
})();

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
        args.db.collection(usersName).find({}, {
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
        args.db.collection(usersName).find({username: args.req.params.userId}, {
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
        user._id = uuid.v1();
        user.username = args.req.body.username;
        user.name = args.req.body.name;
        user.firstName = args.req.body.firstName;
        user.password = args.req.body.password;
        user.role = 'USER'; // set the role default to 'user', consideration of security

        args.user = user;
        if (!(user.username && user.name && user.firstName && user.password)) // && user.role
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
    return new Promise(function (resolve, reject) {
        args.db.collection(usersName).findOneAndUpdate({username: args.user.username}, {$setOnInsert: args.user}, {upsert: true}, function (err, result) {
            //console.log(result);
            if (err)
                reject({status: 400, err: err});
            else
                resolve(args);
        });
    });
}

function updateUser(args) {
    return new Promise(function (resolve, reject) {
        args.db.collection(usersName).updateOne({username: args.req.params.userId}, {$set: args.user}, function (err, result) {
            if (err || result.modifiedCount == 0)
                reject({status: 400, err: err});
            else
                resolve(result);
        });
    });
}

function deleteUser(args) {
    return new Promise(function (resolve, reject) {
        args.db.collection(usersName).deleteOne({username: args.req.params.userId}, {}, function (err, result) {
            if (err || result.deletedCount == 0)
                reject({status: 400, err: err});
            else
                resolve(result);
        });
    });
}

/**
 * @api {get} /api/users Retrieve All
 * @apiName GetAllUsers
 * @apiGroup Users
 *
 * @apiSuccess {Object[]} users list of all users
 * @apiSuccess {String} users._id identifier of user object
 * @apiSuccess {String} users.username username of user
 * @apiSuccess {String} users.role role of use
 * @apiSuccess {String} users.firstName given name of the user
 * @apiSuccess {String} users.name name of user
 *
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.get('/', function (req, res, next) {
    connectToDB(req)
        .then(findAllUsers)
        .then(function (users) {
            res.json(users);
        })
        .catch(function (err) {
            res.sendStatus(err.status);
        });
});

/**
 * @api {post} /api/users Create
 * @apiName Add User
 * @apiGroup Users
 *
 * @apiParam {String} username username of user
 * @apiParam {String} role role of use
 * @apiParam {String} firstName given name of the user
 * @apiParam {String} name name of user
 * @apiParamExample {json} Request-Example:
 *  {
 *      "username" : "maxmustermann",
 *      "name" : "Musterfrau",
 *      "firstName" : "Max",
 *      "role" : "USER"
 *  }
 *
 * @apiSuccess {String} _id identifier of user object
 * @apiSuccess {String} username username of user
 * @apiSuccess {String} role role of use
 * @apiSuccess {String} firstName given name of the user
 * @apiSuccess {String} name name of user
 * @apiSuccessExample {json} Response-Example:
 *  {
 *      "_id" : "7729ab60-a5a3-11e5-a9ce-5b4aa543157d",
 *      "username" : "maxmusterfrau",
 *      "name" : "Musterfrau",
 *      "firstName" : "Max",
 *      "role" : "USER"
 *  }
 *
 * @apiError BadRequest user with given identifier not found or invalid arguments
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.post('/', function (req, res, next) {
    connectToDB(req)
        .then(createUserFromReq)
        .then(hashPassword)
        .then(storeUser)
        .then(function (args) {
            res.json(args.user);
        })
        .catch(function (err) {
            res.sendStatus(400);
        });
});

/**
 * @api {get} /api/users/:id Retrieve One
 * @apiName GetAllUsers
 * @apiGroup Users
 *
 * @apiParam {String} id identifier of user
 *
 * @apiSuccess {String} _id identifier of user object
 * @apiSuccess {String} username username of user
 * @apiSuccess {String} role role of use
 * @apiSuccess {String} firstName given name of the user
 * @apiSuccess {String} name name of user
 * @apiSuccessExample {json} Response-Example:
 *  {
 *      "_id" : "7729ab60-a5a3-11e5-a9ce-5b4aa543157d",
 *      "username" : "maxmustermann",
 *      "name" : "Mustermann",
 *      "firstName" : "Max",
 *      "role" : "USER"
 *  }
 *
 * @apiError BadRequest user with given identifier not found
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
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

/**
 * @api {put} /api/users/:id Update
 * @apiName UpdateUser
 * @apiGroup Users
 *
 * @apiParam {String} id identifier of user object
 * @apiParam {String} username username of user
 * @apiParam {String} role role of use
 * @apiParam {String} firstName given name of the user
 * @apiParam {String} name name of user
 * @apiParamExample {json} Request-Example:
 *  {
 *      "username" : "maxmustermann",
 *      "name" : "Musterfrau",
 *      "firstName" : "Max",
 *      "role" : "USER"
 *  }
 *
 * @apiSuccess {String} _id identifier of user object
 * @apiSuccess {String} username username of user
 * @apiSuccess {String} role role of use
 * @apiSuccess {String} firstName given name of the user
 * @apiSuccess {String} name name of user
 * @apiSuccessExample {json} Response-Example:
 *  {
 *      "_id" : "7729ab60-a5a3-11e5-a9ce-5b4aa543157d",
 *      "username" : "maxmusterfrau",
 *      "name" : "Musterfrau",
 *      "firstName" : "Max",
 *      "role" : "USER"
 *  }
 *
 * @apiError BadRequest user with given identifier not found or invalid arguments
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
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

/**
 * @api {delete} /api/users/:id Delete One
 * @apiName DeleteUser
 * @apiGroup Users
 *
 * @apiParam {String} id identifier of user object which shall be deleted
 *
 * @apiSuccess {String} _id identifier of user object
 * @apiSuccess {String} username username of user
 * @apiSuccess {String} role role of use
 * @apiSuccess {String} firstName given name of the user
 * @apiSuccess {String} name name of user
 * @apiSuccessExample {json} Response-Example:
 *  {
 *      "_id" : "7729ab60-a5a3-11e5-a9ce-5b4aa543157d",
 *      "username" : "maxmusterfrau",
 *      "name" : "Musterfrau",
 *      "firstName" : "Max",
 *      "role" : "USER"
 *  }
 *
 * @apiError BadRequest user with given identifier not found or invalid arguments
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
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
