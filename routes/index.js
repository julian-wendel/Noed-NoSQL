var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendStatus(505);
});

module.exports = router;

 