var http = require('http'),
	Q = require("q"),
	jsdom = require("jsdom"),
	$ = require("jquery")(jsdom.jsdom().defaultView),
	Iconv = require('iconv-lite');

var login = function()
{
	var deferred = Q.defer();

	var req = http.request("http://cu.manmanbuy.com", function(res)
	{
		res.setEncoding('gbk');

		var html = '';

		res.on('data', function(chunk)
		{
			html += chunk;
		})
        .on('end', function()
        {
        	var a = $(html);
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
			title: Iconv.decode($(tds[1]).find("a:first").attr("title"), 'gb2312'),
			price: Iconv.decode($(tds[1]).find("a:first span").text(), 'gb2312'),
			imgFile: Iconv.decode($(tds[0]).find("img").attr("src"), 'gb2312'),
			post: Iconv.decode($(tds[1]).find(".infoD").text(), 'gb2312'),
			linkAddr: "http://cu.manmanbuy.com/" + Iconv.decode($(tds[1]).find("a:first").attr("href"), 'gb2312')
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