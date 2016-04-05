var mongoose = require('./db'),
	db = mongoose.connection;

var postSchema = new mongoose.Schema({
	shortid: String,
	title: String,
	price: String,
	imgFile: String,
	post: String,
	isSuggest: Boolean,
	isPassed: Boolean,
	sugDate: Date,
	suggestBy: String,
	passedDate: Date,
	passedBy: String,
	recordDate: Date,
	recordBy: String,
	linkAddr: String,
	suggestType: String,
	up: Number,
	down: Number,
	fromWeb: String,
	fromId: String
}, {
	collection: 'posts'
});

var postModel = mongoose.model('Post', postSchema);


function Post(option)
{
	this.option = option;
}

module.exports = Post;

//存储一篇文章及其相关信息
Post.prototype.save = function(callback)
{
	var newPost = new postModel(this.option);

	newPost.save(function(err, post)
	{
		if (err)
		{
			return callback(err);
		}
		callback(null, post);

		//db.close();
	});
};

//返回通过标题关键字查询的所有文章信息
Post.search = function(keyword, callback) { };