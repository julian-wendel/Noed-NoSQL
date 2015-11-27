/**
 * Created by nico on 24.11.15.
 */

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var privateKey = "Pass1234_";

/* GET users listing. */
router.get('/', function(req, res, next) {
    if(!(req.body.username && req.body.password)){
        res.sendStatus(400);
        return;
    }

    jwt.sign({username: req.body.username}, privateKey, { expiresIn: "1h"}, function(token){
            res.json({token: token});
    });

});

module.exports = router;
