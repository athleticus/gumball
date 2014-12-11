var express = require('express'),
  config = require('../config'),
  glob = require('glob'),
  mongoose = require('mongoose');

mongoose.connect(config.mongo.url);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.mongo.url);
});

var models = glob.sync(config.webpanel.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model)(mongoose);
});
var app = express();

require('./config/express')(app, config);

app.listen(config.webpanel.port);

