var client = require('./Client/index.js'),
    server = require('./Server/index.js');

module.exports = function(app) {

    client(app);

    server(app);

    app.use(function(req, res) {
        res.render("404");
    });

};