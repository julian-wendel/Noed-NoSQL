/**
 * Created by Julian on 30.11.2015.
 */
var database = require('mongodb').MongoClient;
var conStr = "mongodb://192.168.79.128:27017/nosql";

function getTasksFromList(listID){
    database.connect(conStr, function(err, db) {
        if(!err) {
            console.log("We are connected");
            db.collection("tasks").find(listID).toArray(function(err, result)
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

function insertTask(listID, name){
    database.connect(conStr, function(err, db) {
        if(!err) {
            console.log("We are connected");
            database.connect(conStr, function(err, db) {
                if(!err) {
                    db.collection('tasks').insertOne( {
                        "listId":listID,
                        "name":name,
                        "done":false
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

function updateTask(taskId, listId, name, done){
    database.connect(conStr, function(err, db) {
        if(!err) {
            console.log("We are connected");
            db.collection('tasks').updateOne(
                { "_id" : taskId },
                {
                    $set: {
                        "listId": listId,
                        "name": name,
                        "done": done
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

function deleteTask(taskId){
    database.connect(conStr, function(err, db) {
        if(!err) {
            console.log("We are connected");
            db.collection('tasks').deleteOne(
                { "_id": taskId },
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

function deleteAllTasksInList(listId, db, callback){
    db.collection('tasks').deleteMany(
        { "listId": listId },
        function(err, results) {
            console.log(results);
            return callback();
        }
    );
}