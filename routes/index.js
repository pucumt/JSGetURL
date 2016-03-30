var url1 = require('../models/getmanmanbuy.js');

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
};