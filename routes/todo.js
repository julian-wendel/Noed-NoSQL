/**
 * Created by Julian on 30.11.2015.
 */
var express = require('express');
var router = express.Router();
var database = require('mongodb').MongoClient;
var conStr = "mongodb://127.0.0.1:27017/nosql";
var uuid = require('uuid');

/// <summary>
/// get todo with specified id from database
/// </summary>
/**
 * @api {get} /api/todos?id=:id
 * @apiName GetOneTodo
 * @apiGroup Todos
 *
 * @apiParam {String} id identifier of todo
 *
 * @apiSuccess {Object} todo todo with specified identifier
 * @apiSuccess {String} todo._id identifier of todo
 * @apiSuccess {String} todo.name name of todo
 * @apiSuccess {Boolean} todo.done indicates if todo is done or not
 *
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
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

/// <summary>
/// insert new todo to database
/// </summary>
/**
 * @api {post} /api/todos?id=:id&name=:name
 * @apiName InsertTodo
 * @apiGroup Todos
 *
 * @apiParam {String} id identifier of task list to which todo shall be added
 * @apiParam {String} name name of todo
 *
 * @apiError InvalidParameters parameter missing or invalid
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.post('/', function (req, res, next) {
    if (req.query && req.query._id && req.query.name) {
        var todo = {
            name: req.query.name,
            done: false,
            _id: uuid.v1()
        };
        database.connect(conStr, function (err, db) {
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
						if (err) {
							db.close();
							res.sendStatus(404);
						} else {
							db.close();
							res.json(todo);
						}
					});
			} else {
				db.close();
				res.sendStatus(500);
			}
        });
    }
    else
        res.sendStatus(400)
});

/// <summary>
/// update todo in database
/// </summary>
/**
 * @api {put} /api/todos?_id=:id&_todoId=:todoId&name=:name&done=:done
 * @apiName UpdateTodo
 * @apiGroup Todos
 *
 * @apiParam {String} id identifier of task list which shall be updated
 * @apiParam {String} todoId identifier of todo which shall be updated
 * @apiParam {String} name (new) name of todo
 * @apiParam {Boolean} done (new) value of done
 *
 * @apiError InvalidParameters parameter missing or invalid
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.put('/', function (req, res, next) {
    if (req.query && req.query._id && req.query._todoId && req.query.name && req.query.done) {
        database.connect(conStr, function (err, db) {
            if (!err) {
                db.collection('tasks').updateOne(
                    {"_id": req.query._id, "owner": req.jwt.id, "todos._id": req.query._todoId},
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

/// <summary>
/// delete todo from database
/// </summary>
/**
 * @api {delete} /api/todos?_id=:id&_todoId=:todoId
 * @apiName UpdateTodo
 * @apiGroup Todos
 *
 * @apiParam {String} id identifier of task list which shall be deleted
 * @apiParam {String} todoId identifier of todo which shall be deleted
 *
 * @apiError InvalidParameters parameter missing or invalid
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.delete('/', function (req, res, next) {
    //delete single item
    if (req.query && req.query._id && req.query._todoId) {
        database.connect(conStr, function (err, db) {
            if (!err) {
                db.collection('tasks').updateOne(
                    {
                        "_id": req.query._id,
                        "owner": req.jwt.id
                    },
                    {
                        $pull: {
                            'todos': {'_id': req.query._todoId}
                        }
                    },
                    function (err, result) {
						db.close();
                        res.json(result);
                    }
                );
            }
            else {
                db.close();
                res.sendStatus(500);
            }
        });
    } else if (req.query && req.query._id) {
        database.connect(conStr, function (err, db) {
            if (!err) {
                db.collection('tasks').updateOne(
                    {"_id": req.query._id},
                    {
                        $pullAll: {'todos': []}
                    },
                    function (err, results) {
						db.close();
                        res.sendStatus(200);
                    }
                );
            }
            else {
                db.close();
                res.sendStatus(500);
            }
        });
    }  else
        res.sendStatus(400);
});

module.exports = router;