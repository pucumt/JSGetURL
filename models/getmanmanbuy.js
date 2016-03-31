var http = require('http'),
	Q = require("q"),
	jsdom = require("jsdom"),
	$ = require("jquery")(jsdom.jsdom().defaultView),
	Iconv = require('iconv-lite'),
	BufferHelper = require('bufferhelper');

var login = function()
{
	var deferred = Q.defer();

	var req = http.request("http://cu.manmanbuy.com", function(res)
	{
		var bufferHelper = new BufferHelper();

		res.on('data', function(chunk)
		{
			bufferHelper.concat(chunk);
		})
        .on('end', function()
        {
        	var str = Iconv.decode(bufferHelper.toBuffer(), 'gb2312');
        	var a = $(str);
        	return deferred.resolve(getposts(a.find("#retlistnewdiv")));
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
	list.find(".infolist").each(function(index)
	{
		var tds = $(this).find("tr:first td");
		var post = {
			title: $(tds[1]).find("a:first").attr("title"),
			price: $(tds[1]).find("a:first span").text(),
			imgFile: $(tds[0]).find("img").attr("src"),
			post: $(tds[1]).find(".infoD").text(),
			linkAddr: "http://cu.manmanbuy.com/" + $(tds[1]).find("a:first").attr("href")
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