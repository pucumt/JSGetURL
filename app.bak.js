var http = require('http');
var Q = require("q");
var jsdom = require("jsdom");
var $ = require("jquery")(jsdom.jsdom().defaultView);

var data = 'loginname=weple%40qq.com&md5password=6C243D508B6A399E0E1606E1A1E42A36&currentUrl=http%3A%2F%2Fwww.51bi.com%2F&cookieflag=yes';
var options = {
    host: 'www.51bi.com',
    port: 80,
    path: '/loginForAjax.html',
    method: 'POST',
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'User-agent': 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)',
        'Accept-Language': 'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,zh-TW;q=0.2',
        'Content-length': data.length,
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

var keepAliveAgent = new http.Agent({ keepAlive: true });
options.agent = keepAliveAgent;

var login = function () {
    var deferred = Q.defer();
    
    var req = http.request(options, function (res) {
        options.headers["Cookie"] = res.headers["set-cookie"];
        res.on('data', function (chunk) {
            if (res.statusCode == "200") {
                return deferred.resolve();
            }
            return deferred.reject();
        });
    });
    
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        return deferred.reject();
    });
    
    req.write(data + "\n");
    
    req.end();
    return deferred.promise;
};

var viewThread = function () {
    var deferred = Q.defer();
    
    var curDate = new Date();
    options.path = '/bbs/viewThread.jhtml?year=' + curDate.getFullYear() + '&month=' + (curDate.getMonth() + 1) + '&day=' + curDate.getDate();
    options.method = "GET";
    delete options.headers["Content-length"];
    delete options.headers["Content-Type"];
    
    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        options.path = res.headers["location"];
        if (res.statusCode == "302") {
            return deferred.resolve();
        }
        return deferred.reject();
    });
    
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        return deferred.reject();
    });
    req.end();
    
    return deferred.promise;
};

//used to post data and the following steps
var urlSign, urlID, page;

var viewThreadRedirect = function () {
    urlSign = options.path;
    urlID = options.path.substring(31, 40);
    var deferred = Q.defer();
    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        if (res.statusCode != "200") {
            return deferred.reject();
        }
        var html = '';
        res.on('data', function (chunk) {
            html += chunk;
        })
        .on('end', function () {
            var a = $(html);
            options.path = a.find("#buy_url_" + urlID).attr("href");
            page = a.find("#page").val();
            return deferred.resolve();
        });
    });
    
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        return deferred.reject();
    });
    req.end();
    return deferred.promise;
};

var goQDShop = function () {
    var deferred = Q.defer();
    
    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        
        options.path = res.headers["location"];
        if (res.statusCode == "302") {
            return deferred.resolve();
        }
        return deferred.reject();
    });
    
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        return deferred.reject();
    });
    req.end();
    return deferred.promise;
};

var goQDShopRedirect = function () {//tracing
    var deferred = Q.defer();
    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        if (res.statusCode != "200") {
            return deferred.reject();
        }
        options.headers["Cookie"] = options.headers["Cookie"].concat(res.headers["set-cookie"]);
        
        var html = '';
        res.on('data', function (chunk) {
            html += chunk;
        })
        .on('end', function () {
            options.path = $(html).find("meta[http-equiv=refresh]").attr("url");
            return deferred.resolve();
        });
    });
    
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        return deferred.reject();
    });
    req.end();
    return deferred.promise;
};

var goShopping = function () {
    var deferred = Q.defer();
    
    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        options.headers["Cookie"] = options.headers["Cookie"].concat(res.headers["set-cookie"]);
        res.on('data', function (chunk) {
            if (res.statusCode == "200") {
                return deferred.resolve();
            }
            return deferred.reject();
        });
    });
    
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        return deferred.reject();
    });
    req.end();
    return deferred.promise;
};

var checkQDKey = function () {
    var deferred = Q.defer();
    
    options.path = '/zhekou/zhekou/checkQDKey.jhtml';
    options.method = "POST";
    var data = 'id=' + urlID;
    options.headers['Content-length'] = data.length;
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    
    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.on('data', function (chunk) {
            if (res.statusCode == "200") {
                return deferred.resolve();
            }
            return deferred.reject();
        });
    });
    
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        return deferred.reject();
    });
    req.write(data + "\n");
    req.end();
    return deferred.promise;
};

var replyBiThread = function () {
    var deferred = Q.defer();
    
    var data = '------WebKitFormBoundaryNfDZ8ywDmf5pEXDA' +
            '\r\nContent - Disposition: form-data; name = "id"\r\n\r\n' +
            urlID +
            '\r\n------WebKitFormBoundaryNfDZ8ywDmf5pEXDA' +
            '\r\nContent - Disposition: form-data; name="type"' +
            '\r\n\r\nsa' +
            '\r\n------WebKitFormBoundaryNfDZ8ywDmf5pEXDA' +
            '\r\nContent-Disposition: form-data; name="flagHits"' +
            '\r\n\r\n1' +
            '\r\n------WebKitFormBoundaryNfDZ8ywDmf5pEXDA' +
            '\r\nContent-Disposition: form-data; name="blqdtype"' +
            '\r\n\r\n1' +
            '\r\n------WebKitFormBoundaryNfDZ8ywDmf5pEXDA' +
            '\r\nContent-Disposition: form-data; name="page"\r\n\r\n' +
            page +
            '\r\n------WebKitFormBoundaryNfDZ8ywDmf5pEXDA' +
            '\r\nContent-Disposition: form-data; name="content"' +
            '\r\n\r\n1111111111111111111111111111' +
            '\r\n------WebKitFormBoundaryNfDZ8ywDmf5pEXDA--';
    
    options.path = '/bbs/replyBiThread.html?';
    options.headers['Content-length'] = data.length;
    options.headers['Content-Type'] = 'multipart/form-data; boundary=----WebKitFormBoundaryNfDZ8ywDmf5pEXDA';
    options.headers['Referer'] = urlSign;
    options.headers['Cache-Control'] = 'max-age=0';
    options.headers['Accept-Encoding'] = 'gzip, deflate';
    options.headers['Upgrade-Insecure-Requests'] = 1;
    
    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        options.path = res.headers["location"];
        if (res.statusCode == "302") {
            return deferred.resolve();
        }
        return deferred.reject();
    });
    
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        return deferred.reject();
    });
    req.write(data + "\n");
    req.end();
    return deferred.promise;
};

var replyBiThreadRedirect = function () {
    var deferred = Q.defer();
    
    options.method = "GET";
    options.path = '/zhekou/_pt_288013919_ak_1/';
    delete options.headers["Content-length"];
    delete options.headers["Content-Type"];
    
    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.on('data', function (chunk) {
            if (res.statusCode == "200") {
                return deferred.resolve();
            }
            return deferred.reject();
        });
    });
    
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        return deferred.reject();
    });
    
    req.end();
    return deferred.promise;
};


login().then(viewThread)
.then(viewThreadRedirect)
.then(goQDShop)
.then(goQDShopRedirect)
.then(goShopping)
.then(checkQDKey)
.then(replyBiThread)
.then(replyBiThreadRedirect);