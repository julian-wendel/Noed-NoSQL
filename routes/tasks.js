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
    var find;
    if (req.query && !req.query.public) {
        find = {owner: req.jwt.id};
    }
    else if (req.query && req.query.public) {
        find = {public: req.query.public == 'true'};
    }
    else
        res.sendStatus(400);
    database.connect(conStr, function (err, db) {
        if (!err) {
            console.log("We are connected");
            db.collection("tasks").find(find).toArray(function (err, result) {
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
        }
        else {
            console.log(err);
        }
    });
});

router.post('/', function (req, res, next) {
    if (req.query && req.query.name && req.query.public && req.query.color) {
        var task = req.query;
        task.owner = [req.jwt.id];
        task._id = uuid.v1();
        task.todos = [];
        task.public = (task.public == 'true');

        database.connect(conStr, function (err, db) {
            if (!err) {
                db.collection('tasks').insertOne(task).then(function (result) {
                    db.close();
                    res.json(task);
                }, function (err) {
                    db.close();
                    res.sendStatus(404);
                });
            } else {
                db.close();
                res.sendStatus(500);
            }
        });
    }
    else
        res.sendStatus(400);
});

router.put('/', function (req, res, next) {
    if (req.query && req.query.id && req.query.name && req.query.public) {
        var task = req.query;
        task.public = (task.public == 'true');
        database.connect(conStr, function (err, db) {
            if (!err) {
                var updateOwner = false;
                var task = db.collection('tasks').find({"_id": req.query.id}).toArray();
                if (task.owner.indexOf(req.jwt.id) == -1)
                    updateOwner = true;
                if (updateOwner) {
                    if (req.query.release) {
                        db.collection('tasks').updateOne(
                            {"_id": req.param('_id')},
                            {
                                $set: {
                                    "name": req.query.name,
                                    "public": req.query.public
                                },
                                $pull: {
                                    "owner": req.jwt.id
                                }
                            }, function (err, results) {
                                db.close();
                                task.owner.add(req.jwt.id);
                                res.send(task);
                            });
                    }
                    else {
                        db.collection('tasks').updateOne(
                            {"_id": req.param('_id')},
                            {
                                $set: {
                                    "name": req.query.name,
                                    "public": req.query.public
                                },
                                $push: {
                                    "owner": req.jwt.id
                                }
                            }, function (err, results) {
                                db.close();
                                task.owner.add(req.jwt.id);
                                res.send(task);
                            });
                    }
                }
                else {
                    db.collection('tasks').updateOne(
                        {"_id": req.param('_id')},
                        {
                            $set: {
                                "name": req.query.name,
                                "public": req.query.public
                            }
                        }, function (err, results) {
                            db.close();
                            res.send(task);
                        });
                }
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
    if (req.query && req.query.id) {
        database.connect(conStr, function (err, db) {
            if (!err) {
                console.log("We are connected");
                db.collection('tasks').deleteOne(
                    {"_id": req.query.id},
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