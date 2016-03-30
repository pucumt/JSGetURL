var Post = require('../../models/post.js'),
    Comment = require('../../models/comment.js'),
    suggest = require('./suggest.js'),
    auth = require("./auth"),
    checkLogin = auth.checkLogin,
    shortid = require('shortid'),
    htmlCode = require('../../util/htmlCode.js');

module.exports = function(app) {
    app.get('/article/:id', function(req, res) {
        //查询并返回第 page 页的 20 篇文章
        Post.getOne(req.params.id, true, function(err, post, comments) {
            if (err) {
                post = {};
            }
            if (comments == null) {
                comments = [];
            }
            suggest(function(suggests) {
                res.render('Client/article', {
                    title: '文章',
                    post: post,
                    comments: comments,
                    user: req.session.user,
                    suggests: suggests,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            });
        });
    });

    app.post('/article/:id', checkLogin)
    app.post('/article/:id', function(req, res) {
        var currentUser = req.session.user,
            comment = new Comment({
                postid: req.params.id,
                content: htmlCode.htmlEscape(req.body.content),
                name: currentUser.name,
                date: new Date()
            });
        comment.save(function(err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success', '发布成功!');
            res.redirect('/article/' + comment.option.postid); //发表成功跳转到主页
        });
    });
}