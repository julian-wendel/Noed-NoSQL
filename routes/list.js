/**
 * Created by Julian on 30.11.2015.
 */
var database = require('mongodb').MongoClient;
var conStr = "mongodb://192.168.79.128:27017/nosql";

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
