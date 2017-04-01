var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    Category = mongoose.model('Category');
mongoose.Promise = require('bluebird');

module.exports = function(app) {
    app.use('/', router);
};

//首页
router.get('/', function(req, res, next) {
    var pageNum = req.query.page !== undefined && req.query.page > 0 ? Math.abs(parseInt(req.query.page || 1, 10)) - 1 : 0;
    var pageSize = 10;

    Article.find({
            published: true
        })
        .sort({
                "created":'desc'
            })
        .limit(pageSize).skip(pageNum * 10)
        .populate('author')
        .populate('category')
        .exec(function(err, articles) {
            if (err) return next(err);

            Article.count(function(err, result) {
                var totalCount = result;
                var pageCount = Math.ceil(totalCount / pageSize);

                if (pageNum > pageCount) {
                    pageNum = pageCount;
                }

                res.render('blog/index', {
                    title: 'Blog',
                    pageCount: pageCount,
                    pageNum: pageNum + 1,
                    posts: articles
                });
            })

        });
});
//分类
router.get('/category/:name', function(req, res, next) {
    var pageNum = req.query.page !== undefined && req.query.page > 0 ? Math.abs(parseInt(req.query.page || 1, 10)) - 1 : 0;
    var pageSize = 10;
    Category.find({
            name: req.params.name
        })
        .exec(function(err, category) {
            if (err) return next(err);
            Article.find({
                category: category,
                published:true
            })
            .sort({
                "created":'desc'
            })
            .limit(pageSize)
            .skip(pageNum * 10)
            .populate('author')
            .populate('category')
            .exec(function(err, result) {
                if(err) return next(err);

                Article.find({
                    category:category,
                    published:true
                }).exec(function (err,num) {
                    var totalCount = num.length;
                    var pageCount = Math.ceil(totalCount / pageSize);

                    if (pageNum > pageCount) {
                        pageNum = pageCount;
                    }

                    res.render('blog/category', {
                        title: req.params.name,
                        pageCount: pageCount,
                        pageNum: pageNum + 1,
                        posts: result
                    });
                })
                
            })
        })
});
router.get('/posts/view/:id',function (req,res,next) {
    Article.findOne({
        _id:req.params.id
    })
    .populate('author')
    .populate('category')
    .exec(function (err,article) {
        res.render('blog/detail',{
            article:article
        })
    })
})