var schedule = require('node-schedule'),
	url1 = require('./models/getmanmanbuy.js'),
	Post = require('./models/post.js'),
	Setting = require('./models/setting.js'),
	shortid = require('shortid'),
	htmlCode = require('./util/htmlCode.js');

var setting = new Setting({
	fromWeb: "manmanbuy",
	maxId: 0
});
var manmanbuySetting = null;
setting.get("manmanbuy", function(err, entity)
{
	if (err)
	{
		console.log(err);
	}
	manmanbuySetting = entity;
});

//var i = 0;
var j = schedule.scheduleJob('*/5 * * * *', function()
{
	url1(function(posts)
	{
		posts.sort(function(a, b)
		{
			return parseInt(a.fromId) - parseInt(b.fromId);
		})
		.forEach(function(item)
		{
			if (parseInt(item.fromId) > parseInt(manmanbuySetting.maxId))
			{
				save(item);
				setting.option.maxId = item.fromId;
				setting.update(function(err)
				{
					if (err)
					{
						console.log(err);
					}
				});
				manmanbuySetting.maxId = item.fromId;
			}

		});
		//console.log("hello world!" + (i++));
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
