var Post = require('../../models/post.js'),
    login = require('./login.js'),
    logout = require('./logout.js'),
    post = require('./post.js'),
    reg = require('./reg.js'),
    article = require('./article.js'),
    suggest = require('./suggest.js'),
    qiniu = require('./qiniu.js');

module.exports = function(app) {
    app.get('/', function(req, res) {
        //判断是否是第一页，并把请求的页数转换成 number 类型
        var page = req.query.p ? parseInt(req.query.p) : 1;
        //查询并返回第 page 页的 20 篇文章
        Post.get20(null, page, {
            isPassed: true
        }, function(err, posts, total) {
            if (err) {
                posts = [];
            }
            suggest(function(suggests) {
                res.render('Client/index', {
                    title: '主页',
                    posts: posts,
                    page: page,
                    suggests: suggests,
                    isFirstPage: (page - 1) == 0,
                    isLastPage: ((page - 1) * 20 + posts.length) == total,
                    user: req.session.user,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            });
        });
    });

    app.get('/uptoken', function(req, res) {
        res.jsonp({uptoken:qiniu()});  
    });

    login(app);

    logout(app);

    post(app);

    reg(app);

    article(app);
};