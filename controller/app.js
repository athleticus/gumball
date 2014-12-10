var config = require('../config.js');

var mqtt = require('mqtt'),
    _ = require('underscore'),
    mongoose = require('mongoose');

// connect to mongodb    
mongoose.connect(config.mongodb.url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//create model
var ds = mongoose.Schema({
	rfid: String,
	name: String,
	visits: {
		type: Number,
		default: 0
	}
});

var person = mongoose.model('person', ds);



var client = mqtt.connect(connect.mqtt.url);

_.each(config.mqtt.topics, function(topic, index) {
	client.subscribe(topic);
});

var act = function(id) {
	var success = 0;
	var newVisits = 0;
	var tpl, opts;

	// todo: get entry from db
	person.findOne({rfid: id}, 'name visits', function(err, doc) {
		if(err) {
			return console.error(err);
		} else {
			if(doc != null) {
				console.log('%s %s %d', doc.name, id, doc.visits);
				newVisits = doc.visits + 1;
				opts = {
					tpl: 'success',
					id: id,
					name: doc.name,
					visits: newVisits
				};
				person.update({rfid: id}, {$inc : {visits: 1}}, 
					function (err) {
						if(err) return console.error(err);
					});			
			} else {
				opts = {
					tpl: 'fail',
					id: id
				};
			}
			client.publish(config.mqtt.topics.screen, JSON.stringify(opts));
			
			client.publish(config.mqtt.topics.dispenser, 'yolo');			
		}
	})
};

client.on('message', function(topic, id) {
	// ignore non-reader topics
	if(topic != config.modules.reader) {
		return;
	}

	// run appropriate action
	// todo: abstract
	act(id);		
});