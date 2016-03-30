var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index.js');

var fs = require('fs');
var accessLog = fs.createWriteStream('access.log', { flags: 'a' });
var errorLog = fs.createWriteStream('error.log', { flags: 'a' });

var app = express();

app.set('port', process.env.PORT || 3008);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/default/assets/images/favicon.ico'));
app.use(logger('dev'));
app.use(logger({ stream: accessLog }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

routes(app);

app.use(function(err, req, res, next)
{
	var meta = '[' + new Date() + '] ' + req.url + '\n';
	errorLog.write(meta + err.stack + '\n');
	next();
});

app.listen(app.get('port'), function()
{
	console.log('Express server listening on port ' + app.get('port'));
});