/**
 * Created by Julian on 30.11.2015.
 */
var express = require('express');
var router = express.Router();
var database = require('mongodb').MongoClient;
var conStr = "mongodb://127.0.0.1:27017/nosql";
var uuid = require('uuid');

router.get('/', function (req, res, next) {
    if (req.query && req.query.id && req.query._todoId) {
        database.connect(conStr, function (err, db) {
            if (!err) {
                db.collection('tasks').find({
                    "_id": req.query._id,
                    "owner": req.jwt.id
                }, {todos: {$elemMatch: {"_id": req.query._todoId}}}).toArray(function (err, result) {
                    if (err) {
                        db.close();
                        res.sendStatus(404);
                    }
                    else {
                        db.close();
                        res.send(result);
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

router.post('/', function (req, res, next) {
    if (req.query && req.query._id && req.query.name) {
        var todo = {
            name: req.query.name,
            done: false,
            _id: uuid.v1()
        };
        database.connect(conStr, function (err, db) {
            if (!err) {
                if (!err) {
                    db.collection('tasks').updateOne(
                        {
                            "_id": req.query._id,
                            "owner": req.jwt.id
                        },
                        {
                            $push: {
                                todos: todo
                            }
                        }, function (err, result) {
                            console.log(result);
                            db.close();
                            res.json(todo);
                        });
                }
                else {
                    console.log(err);
                    db.close();
                    res.sendStatus(500);
                }
            }
            else {
                console.log(err);
            }
        });
    }
    else
        res.sendStatus(400)
});

router.put('/', function (req, res, next) {
    if (req.query && req.query._id && req.query._todoId && req.query.name && req.query.done) {
        database.connect(conStr, function (err, db) {
            if (!err) {
                db.collection('tasks').updateOne(
                    {"_id": req.param('_id'), "owner": req.jwt.id, "todos._id": req.query._todoId},
                    {
                        $set: {
                            "todos.$.name": req.query.name,
                            "todos.$.done": 'true' == req.query.done
                        }
                    }, function (err, results) {
                        db.close();
                        res.sendStatus(200);
                    });
            }
            else {
                db.close();
                res.sendStatus(500);
            }
        });
    }
    else
        res.sendStatus(400);
});

//delete item from database
router.delete('/', function (req, res, next) {
    //delete single item
    if (req.query && req.query._id && req.query._todoId) {
        database.connect(conStr, function (err, db) {
            if (!err) {
                db.collection('tasks').updateOne(
                    {
                        "_id": req.query_id,
                        "owner": req.jwt.id
                    },
                    {
                        $pull: {
                            'todos': {'_id': req.query._todoId}
                        }
                    },
                    function (err, results) {
                        res.json(result);
                    }
                );
            }
            else {
                db.close();
                res.sendStatus(500);
            }
        });
    }
    else if (req.query && req.query._id) {
        database.connect(conStr, function (err, db) {
            if (!err) {
                db.collection('tasks').updateOne(
                    {"_id": req.query._id},
                    {
                        $pullAll: {'todos': []}
                    },
                    function (err, results) {
                        res.sendStatus(200);
                    }
                );
            }
            else {
                db.close();
                res.sendStatus(500);
            }
        });
    }
    else
        res.sendStatus(400);
});


module.exports = router;