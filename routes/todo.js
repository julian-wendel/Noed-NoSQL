/**
 * Created by Julian on 30.11.2015.
 */
var express = require('express');
var router = express.Router();
var database = require('mongodb').MongoClient;
var conStr = "mongodb://127.0.0.1:27017/nosql";

//Get items from database
router.get('/', function(req, res, next) {
    if (req.query) {
        var tasks = null;
        database.connect(conStr, function(err, db) {
            if(!err) {
                console.log("We are connected");
                db.collection("todos").find(req.query).toArray(function(err, result)
                {
                    if(err){
                        console.log(err);
                        db.close();
                        res.sendStatus(404);
                    }
                    else{
                        db.close();
                        res.send(result);
                    }
                });
            }
            else{
                console.log(err);
            }
        });
    }
    else
        res.sendStatus(400);
});

//insert item into database
router.post('/', function(req, res, next) {
    if(req.query && req.param('list') && req.param('name')){
        database.connect(conStr, function(err, db) {
            if(!err) {
                console.log("We are connected");
                database.connect(conStr, function(err, db) {
                    if(!err) {
                        db.collection('todos').insertOne( {
                            "list":req.param('owner'),
                            "name":req.param('name'),
                            "done": false
                        }, function(err, result) {
                            assert.equal(err, null);
                            console.log("Task successfully added to List ");
                            db.close();
                            res.send(callback(result));
                        });
                    }
                    else{
                        console.log(err);
                        db.close();
                        res.sendStatus(500);
                    }
                });
            }
            else{
                console.log(err);
            }
        });
    }
    else
        res.sendStatus(400)
});

//update item in database
router.put('/', function(req, res, next) {
    if(req.query && req.param('_id') && req.param('list') && req.param('name') && req.param('done')){
        database.connect(conStr, function(err, db) {
            if(!err) {
                console.log("We are connected");
                db.collection('todos').updateOne(
                    { "_id" : req.param('_id') },
                    {
                        $set: {
                            "_id": req.param('_id'),
                            "list": req.param('list'),
                            "name": req.param('name'),
                            "done": req.param('public')
                        }
                    }, function(err, results) {
                        console.log(results);
                        db.close();
                        res.send(callback());
                    });
            }
            else{
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
router.delete('/', function(req, res, next) {
    //delete single item
    if(req.query && req.param('_id')){
        database.connect(conStr, function(err, db) {
            if(!err) {
                console.log("We are connected");
                db.collection('todos').deleteOne(
                    { "_id": req.param('_id') },
                    function(err, results) {
                        console.log(results);
                        res.send(callback());
                    }
                );
            }
            else{
                console.log(err);
                db.close();
                res.sendStatus(500);
            }
        });
    }
    //delete all items in task
    else if (req.query && req.param('list')){
        database.connect(conStr, function(err, db) {
            if(!err) {
                console.log("We are connected");
                db.collection('todos').deleteMany(
                    { "list": req.param('list') },
                    function(err, results) {
                        console.log(results);
                        res.send(callback());
                    }
                );
            }
            else{
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