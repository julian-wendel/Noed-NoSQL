/**
 * Created by Julian on 30.11.2015.
 */
var express = require('express');
var router = express.Router();
var database = require('mongodb').MongoClient;
var conStr = "mongodb://127.0.0.1:27017/nosql";
var uuid = require('uuid');

var defaultTaskLists = [
	{
		name: 'Daily',
		color: 'white'
	},
	{
		name: 'Private Backlog',
		color: 'amber'
	}, {
		name: 'Work Backlog',
		color: 'lightblue'
	}, {
		name: 'Shopping',
		color: 'green'
	}
];

var createDefaultTaskLists = function(req) {
	var lists = [];

	for (var i = 0; i < defaultTaskLists.length; i++) {
		var list = defaultTaskLists[i];
		lists.push({
			_id: uuid.v1(),
			name: list.name,
			todos: [],
			owner: [req.jwt.id],
			color: list.color,
			public: false
		});
	}
	return lists;
};

//Get items from database
router.get('/', function (req, res, next) {
    var query = {}; // customize the request query for private and public lists

	// check whether the request query includes public lists
    if (req.query && !req.query.public) {
		query = {owner: req.jwt.id};
    } else if (req.query && req.query.public) {
		query = {public: (req.query.public == 'true')};
    } else
        res.sendStatus(400);

    database.connect(conStr, function (err, db) {
        if (!err) {
            console.log("We are connected");
            db.collection("tasks").find(query).toArray(function (err, result) {
                if (err) {
                    console.log(err);
                    db.close();
                    res.sendStatus(404);
                } else {
					if (result.length > 0) {
						db.close();
						res.send(result);
					} else {
						// no list found for this user -> add default lists
						if (!req.query.public) {
							var lists = createDefaultTaskLists(req);
							db.collection('tasks').insertMany(lists, function (err, result) {
								if (err) {
									db.close();
									res.sendStatus(400);
								} else {
									db.close();
									res.send(result.ops);
								}
							});
						}
					}
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
				var docs = db.collection('tasks').find({"_id": req.query.id});

				if (docs != null) {
					docs.toArray(function(error, result) {
						if (!error) {
							for (var i = 0; i < result.length; i++) {
								var o = result[i];

								// adding a public list to own list
								if (o.owner.indexOf(req.jwt.id) < 0) {
									db.collection('tasks').updateOne(
										{"_id": req.query.id},
										{
											$push: {
												"owner": req.jwt.id
											}
										}, function (err, results) {
											db.close();
											res.send(results);
										}
									);
								} else {
									// updating own public list
									db.collection('tasks').updateOne(
										{"_id": req.query.id},
										{
											$set: {
												"name": req.query.name,
												"public": req.query.public
											}
										}, function (err, results) {
											db.close();
											res.send(results);
										}
									);
								}
							}
						} else {
							db.close();
							res.sendStatus(500);
						}
					});
				} else {
					db.close();
					res.sendStatus(404);
				}

                /*var updateOwner = false;
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
                }*/
            }
            else {
                db.close();
                res.sendStatus(500);
            }
        });
    } else
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