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

/// <summary>
/// insert default tasklists for new user into database
/// </summary>
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

/// <summary>
/// Get tasklist from datebase
/// </summary>
/// <description>
/// if req.query.public == true return all public tasklists
/// else return current users tasklists
/// </description>
/**
 * @api {get} /api/tasks?public=:public
 * @apiName GetAllTasks
 * @apiGroup Tasks
 *
 * @apiParam {Boolean} [public] Query parameter for getting only private or public tasks
 *
 * @apiSuccess {Object[]} tasks list of all tasks belonging to the user
 * @apiSuccess {String} tasks._id identifier of task list
 * @apiSuccess {String} tasks.name name of task
 * @apiSuccess {Integer[]} tasks.owner list of user ids which subscribed to this list
 * @apiSuccess {String} tasks.color color of the task list chosen by user
 * @apiSuccess {Boolean} tasks.public indicates if task is public(true) or private(false)
 * @apiSuccess {Object[]} tasks.todos list of all todos in this list
 * @apiSuccess {String} tasks.todos._id identifier of todo
 * @apiSuccess {Boolean} tasks.todos.done indicates if todo is done or not
 *
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.get('/', function (req, res, next) {
    var query = {}; // customize the request query for private and public lists

	// check whether the request query includes public lists
    if (req.query && !req.query.public) {
		query = {owner: req.jwt.id};
    } else if (req.query && req.query.public) {
		query = {public: (req.query.public == 'true')};
    }

    database.connect(conStr, function (err, db) {
        if (!err) {
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

/// <summary>
/// create new tasklist on database
/// </summary>
/**
 * @api {post} /api/tasks
 * @apiName InsertTask
 * @apiGroup Tasks
 *
 * @apiParam {String} name name of task
 * @apiParam {String} color color of the task list chosen by user
 * @apiParam {Boolean} public indicates if task is public(true) or private(false)
 * @apiParamExample {json} Request-Example:
 * 	{
 * 		"name": "My List",
 * 		"color": "lightblue",
 * 		"public": false
 * 	}
 *
 * @apiError InvalidParameters parameters are empty or nor allowed
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.post('/', function (req, res, next) {
    if (req.body && req.body.name && typeof req.body.public == "boolean" && req.body.color) {
		var task = {
			"_id": uuid.v1(),
			"name": req.body.name,
			"public": req.body.public,
			"owner": [req.jwt.id],
			"color": req.body.color,
			"todos": []
		};

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

/// <summary>
/// update tasklist on database
/// </summary>
/**
 * @api {put} /api/tasks/:id
 * @apiName UpdateTask
 * @apiGroup Tasks
 *
 * @apiParam {String} id identifier of task
 *
 * @apiParam {String} name name of task list
 * @apiParam {Boolean} public indicates if task is public(true) or private(false)
 * @apiParamExample {json} Request-Example:
 * 	{
 * 		"name": "My List",
 * 		"color": "lightblue",
 * 		"public": false
 * 	}
 *
 * @apiError InvalidParameters parameters are empty or nor allowed
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.put('/:id', function (req, res, next) {
    if (req.query && req.params.id && req.body.name && typeof req.body.public == "boolean") {
		var task = {
			"_id": req.params.id,
			"public": req.body.public,
			"name": req.body.name
		};

        database.connect(conStr, function (err, db) {
            if (!err) {
				var docs = db.collection('tasks').find({"_id": task._id});

				if (docs != null) {
					docs.toArray(function(error, result) {
						if (!error) {
							for (var i = 0; i < result.length; i++) {
								var o = result[i];

								// adding a public list to own list
								if (o.owner.indexOf(req.jwt.id) < 0) {
									db.collection('tasks').updateOne(
										{"_id": task._id},
										{
											$push: {
												"owner": req.jwt.id
											}
										}, function (err, results) {
											db.close();
											res.send(results);
										}
									);
								} else if (o.owner.indexOf(req.jwt.id) >= 0 && o.owner.length > 1 && !task.public) {
									// the list original owner changes the list to private, so remove other owners out of this shared list
									var owner = o.owner.slice(o.owner.indexOf(req.jwt.id), 1);

									db.collection('tasks').updateOne(
										{"_id": task._id},
										{
											$set: {
												name: task.name,
												public: task.public,
												owner: owner
											}
										}, function (error, results) {
											db.close();
											if (error)
												res.send(error.message);
											else
												res.send(results);
										}
									);
								}
								// Other owner(s) updates this shared list -> just remove the current logged in user
								// from this owner's list, so this list still exists for its original owner and all other users
								// that have added this list to their lists
								else if (o.owner.indexOf(req.jwt.id) >= 0 && o.owner.length > 1 && task.public) {
									db.collection('tasks').updateOne(
										{"_id": task._id},
										{
											$set: {
												name: task.name,
												public: task.public
											},
											$pull: {
												owner: req.jwt.id // pull out the current user from owner's list
											}
										}, function (error, results) {
											db.close();
											if (error)
												res.send(error.message);
											else
												res.send(results);
										}
									);
								} else {
									// updating own public list
									db.collection('tasks').updateOne(
										{"_id": task._id},
										{
											$set: {
												"name": task.name,
												"public": task.public
											}
										}, function (err, results) {
											db.close();
											if (err)
												res.send(err.message);
											else
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

/// <summary>
/// delete tasklist from database
/// </summary>
/**
 * @api {delete} /api/tasks/:id
 * @apiName DeleteTask
 * @apiGroup Tasks
 *
 * @apiParam {String} id identifier of task
 *
 * @apiError InvalidParameters parameters are empty or nor allowed
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.delete('/:id', function (req, res, next) {
    if (req.params.id) {
        database.connect(conStr, function (err, db) {
            if (!err) {
                db.collection('tasks').deleteOne(
                    {"_id": req.params.id},
                    function (err, results) {
						db.close();
						if (err)
							res.send(err.message);
						else
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

/**
 * @api {get} /api/tasks/:id
 * @apiName GetOneTask
 * @apiGroup Tasks
 *
 * @apiParam {String} id identifier of task
 *
 * @apiError InvalidParameters task not found
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.get('/:id', function (req, res, next) {
	if (req.params.id) {
		database.connect(conStr, function (err, db) {
			if (!err) {
				db.collection('tasks').find(
					{"_id": req.params.id}, {}).toArray(
					function (err, results) {
						db.close();
						if (err && results.length > 0)
							res.send(err);
						else
							res.json(results[0]);
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