var settings = require('../settings')
var mongoose = require('mongoose');
mongoose.connect('mongodb://weple001:zwp001@ds047075.mongolab.com:47075/teststore');

module.exports = mongoose;