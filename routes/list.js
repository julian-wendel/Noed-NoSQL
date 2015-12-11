/**
 * Created by Julian on 30.11.2015.
 */
var express = require('express');
var router = express.Router();
var database = require('mongodb').MongoClient;
var conStr = "mongodb://127.0.0.1:27017/nosql";

router.get('/', function(req, res, next) {
    if (req.query) {
        var userId = req.query.id;
        var tasklists = getLists(userId);
        var today = false;
        for (list in tasklists) {
            $scope.tasks.push({name: tasklists[list].name, color: $scope.colors[i % $scope.colors.length]})
            if (tasklists[list].name.eq(getCurrentDate()))
                today = true;
        }
        if (!today) {
            insertList(userId, getCurrentDate(), false);
            $scope.tasks.push({name: getCurrentDate(), color: $scope.colors[2]})
        }
    }
});

router.post('/', function(req, res, next) {

});

//router.update('/', function(req, res, next) {
//
//});

router.delete('/', function(req, res, next) {

});

function getLists(userId){
    database.connect(conStr, function(err, db) {
        if(!err) {
            console.log("We are connected");
            db.collection("lists").find(userId).toArray(function(err, result)
            {
                if(err){
                    console.log(err);
                    res.sendStatus(405);
                }
                else{
                    db.close();
                    return result;
                }
            });
        }
        else{
            console.log(err);
        }
    });
}

function insertList(userID, name, isPublic){
    database.connect(conStr, function(err, db) {
        if(!err) {
            console.log("We are connected");
            database.connect(conStr, function(err, db) {
                if(!err) {
                    db.collection('lists').insertOne( {
                        "userId":userID,
                        "name":name,
                        "public":isPublic
                    }, function(err, result) {
                        assert.equal(err, null);
                        console.log("Task successfully added to List ");
                        db.close();
                        return callback(result);
                    });
                }
                else{
                    console.log(err);
                }
            });
        }
        else{
            console.log(err);
        }
    });
}

function updateTask(listId, name, isPublic){
    database.connect(conStr, function(err, db) {
        if(!err) {
            console.log("We are connected");
            db.collection('lists').updateOne(
                { "_id" : taskId },
                {
                    $set: {
                        "listId": listId,
                        "name": name,
                        "public": isPublic
                    }
                }, function(err, results) {
                    console.log(results);
                    db.close();
                    return callback();
                });
        }
        else{
            console.log(err);
        }
    });
}

function deleteTask(listId){
    database.connect(conStr, function(err, db) {
        if(!err) {
            console.log("We are connected");
            deleteAllTasksInList(listId,db,callback);
            db.collection('lists').deleteOne(
                { "_id": listId },
                function(err, results) {
                    console.log(results);
                    return callback();
                }
            );
        }
        else{
            console.log(err);
        }
    });
}

module.exports = router;