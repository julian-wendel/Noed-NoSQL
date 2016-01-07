/**
 * Created by Julian on 30.11.2015.
 */
var express = require('express');
var router = express.Router();
var database = require('mongodb').MongoClient;
var conStr = "mongodb://127.0.0.1:27017/nosql";
var uuid = require('uuid');

/**
 * @api {get} /api/tasks/:taskId/todos
 * @apiName TASKTODO_GetAllTodosOfList
 * @apiGroup Todos
 *
 * @apiParam {String} taskId identifier of task list
 *
 * @apiSuccess {Object[]} todos todos of task list with specified id
 * @apiSuccess {String} todo._id identifier of todo
 * @apiSuccess {String} todo.name name of todo
 * @apiSuccess {Boolean} todo.done indicates if todo is done or not
 *
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.get('/:taskId/todos/', function (req, res, next) {
    if (req.params.taskId) {
        database.connect(conStr, function (err, db) {
            if (!err) {
                db.collection('tasks').find({
                    "_id": req.params.taskId,
                    "owner": req.jwt.id
                }, {}).toArray(function (err, result) {
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
/// get todo with specified id from database
/// </summary>
/**
 * @api {get} /api/tasks/:taskId/todos/:todoId
 * @apiName TASKTODO_GetOneTodo
 * @apiGroup Todos
 *
 * @apiParam {String} taskId identifier of task list
 * @apiParam {String} todoId identifier of todo

 * @apiSuccess {Object} todo todo with specified identifier
 * @apiSuccess {String} todo._id identifier of todo
 * @apiSuccess {String} todo.name name of todo
 * @apiSuccess {Boolean} todo.done indicates if todo is done or not
 *
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.get('/:taskId/todos/:todoId', function (req, res, next) {
    if (req.params.taskId && req.params.todoId) {
        database.connect(conStr, function (err, db) {
            if (!err) {
                db.collection('tasks').find({
                    "_id": req.params.taskId,
                    "owner": req.jwt.id
                }, {todos: {$elemMatch: {"_id": req.params.todoId}}}).toArray(function (err, result) {
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
 * @api {post} /api/tasks/:taskId/todos
 * @apiName TASKTODO_InsertTodo
 * @apiGroup Todos
 *
 * @apiParam {String} name name of todo
 * @apiParamExample {json} Request-Example:
 *  {
 *      "name": "My Todo"
 *  }
 *
 * @apiError InvalidParameters parameter missing or invalid
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.post('/:taskId/todos', function (req, res, next) {
    if (req.params.taskId && req.body.name) {
        var todo = {
            name: req.body.name,
            done: false,
            _id: uuid.v1()
        };
        database.connect(conStr, function (err, db) {
			if (!err) {
				db.collection('tasks').updateOne(
					{
						"_id": req.params.taskId,
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
 * @api {put} /api/tasks/:taskId/todos/:todoId
 * @apiName TASKTODO_UpdateTodo
 * @apiGroup Todos
 *
 * @apiParam {String} taskId identifier of task list which shall be updated
 * @apiParam {String} todoId identifier of todo which shall be updated
 *
 * @apiParam {String} name (new) name of todo
 * @apiParam {Boolean} done (new) value of done
 *
 * @apiError InvalidParameters parameter missing or invalid
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.put('/:taskId/todos/:todoId', function (req, res, next) {
    if (req.params.taskId && req.params.todoId && req.body.name && typeof req.body.done == "boolean") {
        database.connect(conStr, function (err, db) {
            if (!err) {
                db.collection('tasks').updateOne(
                    {"_id": req.params.taskId, "owner": req.jwt.id, "todos._id": req.params.todoId},
                    {
                        $set: {
                            "todos.$.name": req.body.name,
                            "todos.$.done": req.body.done
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
 * @api {delete} /api/tasks/:taskId/todos/:todoId
 * @apiName TASKTODO_DeleteOneTodo
 * @apiGroup Todos
 *
 * @apiParam {String} taskId identifier of task list which shall be deleted
 * @apiParam {String} todoId identifier of todo which shall be deleted
 *
 * @apiError InvalidParameters parameter missing or invalid
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.delete('/:taskId/todos/:todoId', function (req, res, next) {
    //delete single item
    if (req.params.taskId && req.params.todoId) {
        database.connect(conStr, function (err, db) {
            if (!err) {
                db.collection('tasks').updateOne(
                    {
                        "_id": req.params.taskId,
                        "owner": req.jwt.id
                    },
                    {
                        $pull: {
                            'todos': {'_id': req.params.todoId}
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
    } else
        res.sendStatus(400);
});

/**
 * @api {delete} /api/tasks/:taskId/todos
 * @apiName TASKTODO_DeleteAllTodosInList
 * @apiGroup Todos
 *
 * @apiParam {String} taskId identifier of task list which shall be deleted
 *
 * @apiError InvalidParameters parameter missing or invalid
 * @apiError Unauthorized user not logged in or not permitted to access this api
 */
router.delete('/:taskId/todos', function (req, res, next) {
    //delete single item
    if (req.params.taskId) {
        database.connect(conStr, function (err, db) {
            if (!err) {
                db.collection('tasks').updateOne(
                    {"_id": req.params.taskId},
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