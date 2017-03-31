var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');
  mongoose.Promise = require('bluebird');//

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  Article.find().populate('author').populate('category').exec(function(err, articles) {
    if (err) return next(err);
    res.render('blog/index', {
      title: 'Express!!!',
      posts: articles
    });
  });
});
