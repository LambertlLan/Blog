var express = require('express'),
    router = express.Router(),
    passport = require('passport');
    mongoose = require('mongoose');

module.exports = function(app) {
    app.use('/login', router);
};
router.get('/', function(req, res, next) {
    res.render('admin/login');
});
router.post('/toLogin', passport.authenticate('local', {
    failureRedirect: '/login'
}), function(req, res, next) {
    res.redirect('/admin');
})