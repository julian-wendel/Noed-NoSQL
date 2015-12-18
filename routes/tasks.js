/**
 * Created by Julian on 30.11.2015.
 */
var express = require('express');
var router = express.Router();
var database = require('mongodb').MongoClient;
var conStr = "mongodb://127.0.0.1:27017/nosql";
var uuid = require('uuid');

//Get items from database
router.get('/', function(req, res, next) {
    if (req.query && req.query.owner) {
        database.connect(conStr, function(err, db) {
            if(!err) {
                console.log("We are connected");
                db.collection("tasks").find({ owner: { $elemMatch: {$in:req.param('owner')}}}).toArray(function(err, result)
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
    else if (req.query && req.query.public) {
        database.connect(conStr, function(err, db) {
            if(!err) {
                console.log("We are connected");
                db.collection("tasks").find({ public: req.param('public')}).toArray(function(err, result)
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

//insert a todo task into database
router.post('/', function (req, res, next) {
	if (req.query && req.query.owner && req.query.name && req.query.public && req.query.color) {
        var task = req.query;
        task.owner = [req.query.owner];
        task._id = uuid.v1();
        task.todos = [];
		database.connect(conStr, function (err, db) {
			if (!err) {
				// insert using a promise
				db.collection('tasks').insertOne(task).then(function(result) {
					console.log("Successfully added a task list to database.");
					db.close();
					// not returning anything, just send OK status
					res.json(task);
				}, function(err) {
					console.log('Error adding task list. Error: ' + err);
					db.close();
					res.sendStatus(404);
				});
			} else {
				console.log('Error connecting to database. Reason: ' + err);
				db.close();
				res.sendStatus(500);
			}
		});
	} else
		res.sendStatus(400)
});

//update item in database
router.put('/', function(req, res, next) {
    if(req.query && req.param('_id') && req.param('name') && req.param('public') && req.param('owner')){
        database.connect(conStr, function(err, db) {
            if(!err) {
                console.log("We are connected");
                var updateOwner = false;
                var task = db.collection('tasks').find({"_id":req.param('_id')}).toArray();
                if(task.owner.indexOf(req.param('owner')) == -1)
                    updateOwner = true;
                if(updateOwner) {
                    db.collection('tasks').updateOne(
                        {"_id": req.param('_id')},
                        {
                            $set: {
                                "name": req.param('name'),
                                "public": req.param('public')
                            },
                            $push: {
                                "owner": req.param('owner')
                            }
                        }, function (err, results) {
                            console.log(results);
                            db.close();
                            res.send(callback());
                        });
                }
                else{
                    db.collection('tasks').updateOne(
                        {"_id": req.param('_id')},
                        {
                            $set: {
                                "name": req.param('name'),
                                "public": req.param('public')
                            }
                        }, function (err, results) {
                            console.log(results);
                            db.close();
                            res.send(callback());
                        });
                }
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
    if(req.query && req.param('_id')){
        database.connect(conStr, function(err, db) {
            if(!err) {
                console.log("We are connected");
                db.collection('tasks').deleteOne(
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
    else
        res.sendStatus(400);
});


module.exports = router;