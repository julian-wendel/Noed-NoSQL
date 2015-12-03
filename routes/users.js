var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({message: 'It Works!'});
});

module.exports = router;
