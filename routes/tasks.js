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
  if(req.query && req.param('owner') && req.param('name') && req.param('public')){
      database.connect(conStr, function(err, db) {
          if(!err) {
              console.log("We are connected");
              database.connect(conStr, function(err, db) {
                  if(!err) {
                      db.collection('lists').insertOne( {
                          "owner":req.param('owner'),
                          "name":req.param('name'),
                          "public": req.param('public')
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
    if(req.query && req.param('_id') && req.param('name') && req.param('public')){
        database.connect(conStr, function(err, db) {
            if(!err) {
                console.log("We are connected");
                db.collection('lists').updateOne(
                    { "_id" : req.param('_id') },
                    {
                        $set: {
                            "_id": req.param('_id'),
                            "name": req.param('name'),
                            "public": req.param('public')
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
    if(req.query && req.param('_id')){
        database.connect(conStr, function(err, db) {
            if(!err) {
                console.log("We are connected");
                deleteAllTasksInList(listId,db,callback);
                db.collection('lists').deleteOne(
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