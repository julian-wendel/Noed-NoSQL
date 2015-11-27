var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  bcrypt.compare('admin', '$2a$10$5jcGmevNdmo1WxCNH3rZcuz/TgLsORKDRx8sveDqN6ymO8eFV0evO', function(err, res){
    console.log(res);
  })
});

module.exports = router;
