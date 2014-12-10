var config = require('../config.js');

var mqtt = require('mqtt'),
    _ = require('underscore'),
    mongoose = require('mongoose');

// connect to mqtt
var client = mqtt.connect(config.mqtt.url);

_.each(config.mqtt.topics, function(topic, index) {
	client.subscribe(topic);
});

// connect to mongodb    
mongoose.connect(config.mongo.url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//create model
var person = mongoose.model('person', mongoose.Schema(require('./models/person')));

var act = function(id) {
	var success = 0;
	var newVisits = 0;
	var tpl, opts;

	// get entry from db
	person.findOne({rfid: id}, 'name visits', function(err, doc) {
		if(err) {
			return console.error(err);
		} else {
			success = doc != null;
			if(success) {
				console.log('%s %s %d', doc.name, id, doc.visits);
				newVisits = doc.visits + 1;
				opts = {
					tpl: 'success',
					id: id,
					name: doc.name,
					visits: newVisits
				};
				person.update({
						rfid: id
					}, {
						$inc : {
							visits: 1
						}
					}, 
					function (err) {
						if(err) {
							return console.error(err);
						}
					});			
			} else {
				opts = {
					tpl: 'fail',
					id: id
				};
			}

			// broadcast to screen
			client.publish(config.mqtt.topics.screen, JSON.stringify(opts));

			// broadcast to dispenser
			if(success) {
				client.publish(config.mqtt.topics.dispenser, 'yolo');
			}
		}
	})
};

client.on('message', function(topic, id) {
	// ignore non-reader topics
	if(topic != config.mqtt.topics.reader) {
		return;
	}

	// run appropriate action
	// todo: abstract?
	act(id);		
});