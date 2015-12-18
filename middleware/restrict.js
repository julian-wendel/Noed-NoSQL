/**
 * Created by nico on 03.12.15.
 */

var jwt = require('jsonwebtoken');

module.exports = {
    to: function(roles){
            return function(req, res, next){
                if(req.headers['x-auth-token']){
                    jwt.verify(req.headers['x-auth-token'], 'Pass1234_', {}, function(err, data){
                        if(err || roles.indexOf(data.role) == -1) return res.sendStatus(401);
                        req.jwt = data;
                        return next();
                    });
                }else{
                    return res.sendStatus(401);
                }
            }
    }
}