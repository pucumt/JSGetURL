var schedule = require('node-schedule'),
	urlManManBuy = require('./models/getmanmanbuy.js'),
	urlSMZDM = require('./models/smzdm.js'),
	Post = require('./models/post.js'),
	Setting = require('./models/setting.js'),
	shortid = require('shortid'),
	htmlCode = require('./util/htmlCode.js');

var manmanbuySetting = {
	fromWeb: "manmanbuy",
	maxId: 0
};

var smzdmSetting = {
	fromWeb: "smzdm",
	maxId: 0
};

Setting.get(function(err, entities) {
	if (err) {
		console.log(err);
	}

	if (entities.length > 0) {
		entities.forEach(function(entity) {
			switch (entity.fromWeb) {
				case "manmanbuy":
					manmanbuySetting = entity;
					break;
				case "smzdm":
					smzdmSetting = entity;
					break;
			}
		});
	}

	if (manmanbuySetting.maxId == 0) {
		new Setting(manmanbuySetting).save(function(err) {

		});
	}

	if (smzdmSetting.maxId == 0) {
		new Setting(smzdmSetting).save(function(err) {

		});
	}
	start();
});

var start = function() {
	//var i = 0;
	var isdone = true;
	var j = schedule.scheduleJob('*/1 * * * *', function() {
		if (!isdone) return;

		isdone = false;
		handle(manmanbuySetting, urlManManBuy, function() {
			handle(smzdmSetting, urlSMZDM, function() {
				isdone = true;
			});
		});
	});
}

var handle = function(settings, handles, callback) {
	var settingM = new Setting(settings);
	handles(function(posts) {
		posts.sort(function(a, b) {
				return parseInt(a.fromId) - parseInt(b.fromId);
			})
			.forEach(function(item) {
				if (parseInt(item.fromId) > parseInt(settings.maxId)) {
					save(item);
					settingM.option.maxId = item.fromId;
					settingM.update(function(err) {
						if (err) {
							console.log(err);
						}
					});
					settings.maxId = item.fromId;
				}

			});

		callback();
	});
}

var save = function(entity) {
	post = new Post({
		shortid: shortid.generate(),
		title: entity.title,
		price: entity.price,
		imgFile: entity.imgFile,
		linkAddr: entity.linkAddr,
		post: htmlCode.htmlEscape(entity.post),
		recordBy: "管理员",
		recordDate: new Date(),
		isPassed: true,
		fromWeb: "manmanbuy",
		fromId: ""
	});
	post.save(function(err) {
		if (err) {
			console.log(err);
		}
	});
}