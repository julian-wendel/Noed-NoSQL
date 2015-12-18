/**
 * Created by Julian on 30.11.2015.
 */
var express = require('express');
var router = express.Router();
var database = require('mongodb').MongoClient;
var conStr = "mongodb://127.0.0.1:27017/nosql";
var uuid = require('uuid');
//Get items from database
router.get('/', function (req, res, next) {
    if (req.query && req.param('_id') && req.param('_todoId')) {
        database.connect(conStr, function (err, db) {
            if (!err) {
                console.log("We are connected");
                db.collection('tasks').find({
                    "_id": req.param('_id'),
                    "owner": req.jwt.id
                }, {todos: {$elemMatch: {"_id": req.param('_todoId')}}}).toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                        db.close();
                        res.sendStatus(404);
                    }
                    else {
                        db.close();
                        res.send(result);
                    }
                });

            } else {
                // error connecting to database
                console.log(err);
                res.sendStatus(500);
                db.close();
            }
        });
    }
    else
        res.sendStatus(400);
});

//insert item into database
router.post('/', function (req, res, next) {
    if (req.query && req.param('_id') && req.param('name')) {
        var todo = {
            name: req.param('name'),
            done: false,
            _id: uuid.v1()
        };

        database.connect(conStr, function (err, db) {
            if (!err) {
                console.log("We are connected");
                if (!err) {
                    //TODO int parsing
                    db.collection('tasks').updateOne(
                        {
                            "_id": req.param('_id'),
                            "owner": req.jwt.id
                        },
                        {
                            $push: {
                                todos: todo
                            }
                        }, function (err, result) {
                            //assert.equal(err, null);
                            console.log("Todo successfully added to TaskList ");
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

//update item in database
router.put('/', function (req, res, next) {
    if (req.query && req.param('_id') && req.param('_todoId') && req.param('name') && req.param('done')) {
        database.connect(conStr, function (err, db) {
            if (!err) {
                console.log("We are connected");
                db.collection('tasks').updateOne(
                    {"_id": req.param('_id'), "owner": req.jwt.id, "todos._id": req.param('_todoId')},
                    {
                        $set: {
                            "todos.$.name": req.param('name'),
                            "todos.$.done": 'true' == req.param('done')
                        }
                    }, function (err, results) {
                        console.log(results);
                        db.close();
                        res.sendStatus(200);
                    });
            }
            else {
                console.log(err);
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
    if (req.query && req.param('_id') && req.param('_todoId')) {
        database.connect(conStr, function (err, db) {
            if (!err) {
                console.log("We are connected");
                db.collection('tasks').updateOne(
                    {
                        "_id": req.param('_id'),
                        "owner": req.jwt.id
                    },
                    {
                        $pull: {
                            'todos': {'_id': req.param('_todoId')}
                        }
                    },
                    function (err, results) {
                        console.log(results);
                        res.json(result);
                    }
                );
            }
            else {
                console.log(err);
                db.close();
                res.sendStatus(500);
            }
        });
    }
    //delete all items in task
    else if (req.query && req.param('_id')) {
        database.connect(conStr, function (err, db) {
            if (!err) {
                console.log("We are connected");
                db.collection('tasks').updateOne(
                    {"_id": req.param('_id')},
                    {
                        $pullAll: {'todos': []}
                    },
                    function (err, results) {
                        console.log(results);
                        res.send(callback());
                    }
                );
            }
            else {
                console.log(err);
                db.close();
                res.sendStatus(500);
            }
        });
    }
    else
        res.sendStatus(400);
});


module.exports = router;