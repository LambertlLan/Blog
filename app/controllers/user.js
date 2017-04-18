var express = require('express'),
    router = express.Router(),
    passport = require('passport');
    mongoose = require('mongoose');

module.exports = function(app) {
    app.use('/login', router);
};
module.exports.requireLogin = function (req,res,next) {
    if(req.user){
        next();
    }else{
        req.flash('error','登录用户才能访问！')
        res.redirect('/login');
    }
};
router.get('/', function(req, res, next) {
    res.render('admin/login');
});
router.post('/toLogin', passport.authenticate('local', {
    failureRedirect: '/login'
}), function(req, res, next) {
    res.redirect('/admin');
});
router.get('/logout',function (req,res,next) {
    req.logout();
    res.redirect('/admin');
})