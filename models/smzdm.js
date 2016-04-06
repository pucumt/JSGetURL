var http = require('http'),
	Q = require("q"),
	jsdom = require("jsdom"),
	$ = require("jquery")(jsdom.jsdom().defaultView),
	Iconv = require('iconv-lite'),
	BufferHelper = require('bufferhelper');

var login = function()
{
	var deferred = Q.defer();

	var req = http.request("http://www.smzdm.com/", function(res)
	{
		var bufferHelper = new BufferHelper();

		res.on('data', function(chunk)
		{
			bufferHelper.concat(chunk);
		})
        .on('end', function()
        {
        	var str = Iconv.decode(bufferHelper.toBuffer(), 'utf8');
        	var a = $(str);
        	return deferred.resolve(getposts(a));
        });
	});

	req.on('error', function(e)
	{
		console.log('problem with request: ' + e.message);
		return deferred.reject();
	});

	req.end();
	return deferred.promise;
};

var getposts = function(list)
{
	var posts = [];
	var lists = list.find(".leftWrap .list");
	lists.splice(0, 1);
	lists.each(function(index)
	{
		var post = {
			title: $(this).find("a.picLeft img").attr("alt"),
			price: $(this).find(".listTitle h4.itemName a span.red").text(),
			imgFile: $(this).find("a.picLeft img").attr("src"),
			post: $(this).find(".listRight .lrInfo").text(),
			linkAddr: $(this).find("a.picLeft").attr("href"),
			fromId: $(this).attr("timesort")
		};
		posts.push(post);
	});

	return posts;
};

module.exports = function(callback)
{
	login().then(function(data)
	{
		callback(data);
	});
};