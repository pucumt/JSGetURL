var http = require('http'),
	Q = require("q"),
	jsdom = require("jsdom"),
	$ = require("jquery")(jsdom.jsdom().defaultView);

var login = function()
{
	var deferred = Q.defer();

	var req = http.request("http://cu.manmanbuy.com", function(res)
	{
		res.on('data', function(chunk)
		{
			if (res.statusCode == "200")
			{
				return deferred.resolve();
			}
			return deferred.reject();
		});
	});

	req.on('error', function(e)
	{
		console.log('problem with request: ' + e.message);
		return deferred.reject();
	});

	req.write(data + "\n");

	req.end();
	return deferred.promise;
};


module.exports = function(callback)
{
	login();
	callback([]);
};