var Post = require('../../models/post.js'),
	auth = require("./auth"),
	checkLogin = auth.checkLogin,
	shortid = require('shortid'),
	suggest = require('./suggest.js'),
	htmlCode = require('../../util/htmlCode.js');

module.exports = function(app) {
	app.get('/post', checkLogin);
	app.get('/post', function(req, res) {
		suggest(function(suggests) {
			res.render('Client/post', {
				title: '发表',
				user: req.session.user,
				suggests: suggests,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	});

	app.post('/post', checkLogin);
	app.post('/post', function(req, res) {
		var currentUser = req.session.user,
			post = new Post({
				shortid: shortid.generate(),
				title: req.body.title,
				price: req.body.price,
				imgFile: req.body.img,
				linkAddr: req.body.linkAddr,
				post: htmlCode.htmlEscape(req.body.post),
				recordBy: currentUser.name,
				recordDate: new Date()
			});
		post.save(function(err) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			req.flash('success', '发布成功!');
			res.redirect('/'); //发表成功跳转到主页
		});
	});
}