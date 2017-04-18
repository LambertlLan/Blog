var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    slug = require('slug'),
    auth = require('./user'),
    Category = mongoose.model('Category');
var upload = require('../models/upload');

module.exports = function(app) {
    app.use('/admin', router);
};
//后台首页
router.get('/',auth.requireLogin , function(req, res, next) {
    Article.find(function(err, articles) {
        if (err) return next(err);
        res.render('admin/index');
    });
});
//文章列表
router.get('/postsList',auth.requireLogin , function(req, res, next) {
    //分页
    var pageNum = req.query.page !== undefined && req.query.page > 0 ? Math.abs(parseInt(req.query.page || 1, 10)) - 1 : 0;
    var pageSize = 10;

    //排序
    var sortby = req.query.sortby ? req.query.sortby : 'created';
    var sortdir = req.query.sortdir ? req.query.sortdir : 'desc';
    //过滤
    var conditions = {};
    if(req.query.filter && req.query.filter!=='undefined' && req.query.filter!=='all'){
        conditions = {
            published: true,
            category:req.query.filter.trim()
        }
    }

    if (['title', 'category', 'created'].indexOf(sortby) === -1) {
        sortby = 'created';
    }
    if (['desc', 'asc'].indexOf(sortdir) === -1) {
        sortdir = 'desc'
    }
    var sortObj = {};
    sortObj[sortby] = sortdir;
    Article.find(conditions)
        .sort(sortObj)
        .limit(pageSize).skip(pageNum * 10)
        .populate('author')
        .populate('category')
        .exec(function(err, articles) {
            if (err) return next(err);
            Article.find(conditions).count(function(err, result) {
                var totalCount = result;
                var pageCount = Math.ceil(totalCount / pageSize);

                if (pageNum > pageCount) {
                    pageNum = pageCount;
                }

                res.render('admin/posts/posts_list', {
                    title: 'Blog',
                    pageCount: pageCount,
                    pageNum: pageNum + 1,
                    posts: articles,
                    sortby: sortby,
                    sortdir: sortdir,
                    filter:req.query.filter
                });
            })

        });
});
//删除文章
router.get('/deletePost/:id',auth.requireLogin , function(req, res, next) {
    if (!req.params.id) {
        return next(new Error('not post id provided'));
    }
    Article.remove({
        _id: req.params.id
    }).exec(function(err, rowsRemoved) {
        if (err) {
            return next(err)
        }
        // res.send(rowsRemoved);
        res.redirect('/admin/postsList')
    })
});
//添加文章
router.get('/addPost',auth.requireLogin , function(req, res, next) {
    res.render('admin/posts/addPost', {
            article: {},
            action:'/admin/add'
        })
});

router.post('/add',auth.requireLogin , function(req, res, next) {

    req.checkBody('title', '文章标题不能为空').notEmpty();
    req.checkBody('category', '文章分类不能为空').notEmpty();
    req.checkBody('content', '文章内容不能为空').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return res.render('admin/posts/addPost', {
            errors: errors
        })
    }

    var query = req.body;
    var title = query.title.trim();
    var category = query.category.trim();
    var content = query.content.trim();
    var author = '58dcabb860a26c280852e967';

    var post = new Article({
        title: title,
        content: content,
        slug: title,
        category: category,
        author: author,
        published: true,
        imgUrl: '/img/07.jpg',
        meta: {
            favorites: 0
        },
        comments: [],
        created: new Date
    });
    post.save(function(err, data) {
        if (err) {
            console.dir('cannot save post')
            return next(err);
        }
        res.redirect('/admin/postsList');
    })
});
//修改文章
router.get('/edit/:id',auth.requireLogin ,getArticle, function(req, res, next) {
    res.render('admin/posts/addPost', {
        article: req.post,
        action:'/admin/edit/'+req.params.id
    })
});
router.post('/edit/:id',auth.requireLogin ,getArticle,function(req, res, next) {

    req.checkBody('title', '文章标题不能为空').notEmpty();
    req.checkBody('category', '文章分类不能为空').notEmpty();
    req.checkBody('content', '文章内容不能为空').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return res.render('admin/posts/addPost', {
            errors: errors
        })
    }
    var query = req.body;
    req.post.title = query.title.trim();
    req.post.category = query.category.trim();
    req.post.content = query.content.trim();
    req.post.save(function(err, data) {
        if (err) {
            console.dir('cannot save post')
            return next(err);
        }
        res.redirect('/admin/postsList');
    })

});
//修改文章
router.post('/upload',upload.uploadImg);
function getArticle(req,res,next) {
    Article.findOne({
        _id: req.params.id
    }, function(err, post) {
        if (err) {
            console.dir('cannot find this post' + req.query.id)
            return next(err)
        }
        req.post = post
        next();
    })
}