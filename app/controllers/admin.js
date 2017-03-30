var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');

module.exports = function (app) {
  app.use('/admin', router);
};

router.get('/', function (req, res, next) {
  Article.find(function (err, articles) {
    if (err) return next(err);
    res.render('admin/index');
  });
});
router.get('/login', function (req, res, next) {
  Article.find(function (err, articles) {
    if (err) return next(err);
    res.render('admin/login');
  });
});