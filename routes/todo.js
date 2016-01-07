/**
 * Created by Julian on 30.11.2015.
 */
var express = require('express');
var router = express.Router();
var database = require('mongodb').MongoClient;

var config = require('../settings');

var conStr = "mongodb://" + config.mongodb.host + ":" + config.mongodb.port + "/" + config.mongodb.database;
var tasksName = config.mongodb.collections.tasks;

/**
 * @api {get} /api/todos/:id Retrieve One
 * @apiName TODO_GetOneTodo
 * @apiGroup Todos
 *
 * @apiParam {String} todoId identifier of todo
 *
 * @apiSuccess {String} _id identifier of todo
 * @apiSuccess {String} name name of todo
 * @apiSuccess {Boolean} done indicates if todo is done or not
 *
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.get('/:id', function (req, res, next) {
    if (req.params.id) {
        database.connect(conStr, function (err, db) {
            if (!err) {
                db.collection(tasksName).find({
                    "todos._id": req.params.id,
                    "owner": req.jwt.id
                }, {}).toArray(function (err, result) {
                    if (err && result.length > 0) {
                        db.close();
                        res.sendStatus(404);
                    }
                    else {
                        db.close();
                        res.send(result[0].todos[0]);
                    }
                });
            } else {
                res.sendStatus(500);
                db.close();
            }
        });
    }
    else
        res.sendStatus(400);
});

/**
 * @api {put} /api/todos/:id Update
 * @apiName TODO_UpdateOneTodo
 * @apiGroup Todos
 *
 * @apiParam {String} todoId identifier of todo
 *
 * @apiSuccess {String} _id identifier of todo
 * @apiSuccess {String} name name of todo
 * @apiSuccess {Boolean} done indicates if todo is done or not
 *
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.put('/:id', function (req, res, next) {
    if (req.params.id && req.body.name && typeof req.body.done == 'boolean') {
        database.connect(conStr, function (err, db) {
            if (!err) {
                db.collection(tasksName).updateOne({
                    "todos._id": req.params.id,
                    "owner": req.jwt.id
                },
                    {
                    $set: {
                        "todos.$.name": req.body.name,
                        "todos.$.done": req.body.done
                    }
                }).toArray(function (err, result) {
                    if (err && result.length > 0) {
                        db.close();
                        res.sendStatus(404);
                    }
                    else {
                        db.close();
                        res.send(result[0].todos[0]);
                    }
                });
            } else {
                res.sendStatus(500);
                db.close();
            }
        });
    }
    else
        res.sendStatus(400);
});

/**
 * @api {delete} /api/todos/:id Delete One
 * @apiName TODO_DeleteTodo
 * @apiGroup Todos
 *
 * @apiParam {String} id identifier of todo
 *
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.delete('/:id', function (req, res, next) {
    if (req.params.id) {
        database.connect(conStr, function (err, db) {
            if (!err) {
                db.collection(tasksName).find({
                    "todos._id": req.params.id,
                    "owner": req.jwt.id
                }, {
                    $pull: {
                        'todos': {'_id': req.params.id}
                    }
                }).toArray(function (err, result) {
                    if (err && result.length > 0) {
                        db.close();
                        res.sendStatus(404);
                    }
                    else {
                        db.close();
                        res.send(result[0].todos[0]);
                    }
                });
            } else {
                res.sendStatus(500);
                db.close();
            }
        });
    }
    else
        res.sendStatus(400);
});

module.exports = router;