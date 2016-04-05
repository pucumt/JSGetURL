var schedule = require('node-schedule'),
	url1 = require('../models/getmanmanbuy.js'),
	Post = require('../../models/post.js'),
	shortid = require('shortid'),
	htmlCode = require('../../util/htmlCode.js');

var j = schedule.scheduleJob('*/5 * * * *', function()
{
	url1(function(posts)
	{
		save();
	});
});

var save = function(entity)
{
	post = new Post({
		shortid: shortid.generate(),
		title: entity.title,
		price: entity.price,
		imgFile: entity.img,
		linkAddr: entity.linkAddr,
		post: htmlCode.htmlEscape(entity.post),
		recordBy: "管理员",
		recordDate: new Date(),
		isPassed: true,
		fromWeb: "manmanbuy",
		fromId: ""
	});
	post.save(function(err)
	{
		if (err)
		{
			console.log(err);
		}
	});
}
