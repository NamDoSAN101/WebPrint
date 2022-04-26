const   Print = require('../models/print'),
        Comment = require('../models/comment');

const   middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to login first');
    res.redirect('/login');
}

module.exports = middlewareObj;