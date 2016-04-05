var mongoose = require('./db'),
	db = mongoose.connection;

var settingSchema = new mongoose.Schema({
	fromWeb: String,
	maxId: String
}, {
	collection: 'settings'
});

var settingModel = mongoose.model('settings', settingSchema);


function Setting(option)
{
	this.option = option;
}

module.exports = Setting;

//存储一篇文章及其相关信息
Setting.prototype.save = function(callback)
{
	var newSetting = new settingModel(this.option);

	newSetting.save(function(err, entity)
	{
		if (err)
		{
			return callback(err);
		}
		callback(null, entity);

		//db.close();
	});
};

//读取用户信息
Setting.prototype.get = function(fromWeb, callback)
{
	var self = this;
	//打开数据库
	settingModel.findOne({ fromWeb: fromWeb }, function(err, entity)
	{
		if (err)
		{
			return callback(err);
		}

		if (!entity)
		{
			self.option = {
				fromWeb: fromWeb,
				maxId: 0
			};
			self.save(callback);
		}
		else
		{
			callback(null, entity);
		}
		//db.close();
	});
};

Setting.prototype.update = function(callback)
{
	settingModel.update({
		fromWeb: this.option.fromWeb
	}, this.option).exec(function(err, entity)
	{
		if (err)
		{
			return callback(err);
		}
		callback(null, entity);
	});
};