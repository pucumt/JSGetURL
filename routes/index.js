var url1 = require('../models/getmanmanbuy.js'),
	Post = require('../../models/post.js'),
	shortid = require('shortid'),
	htmlCode = require('../../util/htmlCode.js');

module.exports = function(app)
{
	app.get('/', function(req, res)
	{
		url1(function(posts)
		{
			res.render('index', {
				title: '主页',
				posts: posts
			});
		});
	});

	app.post('/post', function(req, res)
	{
		var currentUser = req.session.user,
			post = new Post({
				shortid: shortid.generate(),
				title: req.body.title,
				price: req.body.price,
				imgFile: req.body.img,
				linkAddr: req.body.linkAddr,
				post: htmlCode.htmlEscape(req.body.post),
				recordBy: "管理员",
				recordDate: new Date()
			});
		post.save(function(err)
		{
			if (err)
			{
				req.flash('error', err);
				return res.redirect('/');
			}
			req.flash('success', '发布成功!');
			res.redirect('/'); //发表成功跳转到主页
		});
	});
};