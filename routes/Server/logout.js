var auth = require("./auth"),
	checkLogin = auth.checkLogin;

module.exports = function(app) {
	app.get('/admin/logout', checkLogin);
	app.get('/admin/logout', function(req, res) {
		req.session.user = null;
		req.flash('success', '登出成功!');
		res.redirect('/'); //登出成功后跳转到主页
	});
}