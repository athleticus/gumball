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
var person = require('./models/person')(mongoose);
var records = require('./models/records')(mongoose);

var act = function(id) {
	var success = 0;
	var newVisits = 0;
	var tpl, opts;
	//check for uses in last [accessPeriod] milliseconds
	var date = Date.now() - config.modules.controller.accessPeriod;
	records.count({rfid: id, timestamp: {$gt: date}}, 
		function(err, count){
			if(err) {
				return console.error(err);
			// check if uses exceeds accessAmount within accessPeriod
			} else if (count < config.modules.controller.accessAmount) {
				recordVisit(id);
			} else {
				opts = {
					tpl: 'fatty',
				};
				client.publish(config.mqtt.topics.screen, JSON.stringify(opts));
			}
		});
}

var recordVisit = function(id) {
	var record = new records({rfid: id});
	record.save(function a(err) {
		if (err) {
			return console.error(err);
		} else {
			//Date range that number of visits will be displayed for
			date = Date.now() - config.modules.controller.recentVisitTimeframe
			records.count({rfid: id, timestamp: {$gt: date}}, 
				function(err, count){
					if(err) {
						return console.error(err);
					} else {
						//console.log(count);
						var num = count;
						send(id, num);
					}
				});
		}
	});
}
	
var send = function(id, num) {
	person.findOne({rfid: id}, 'name visits', function (err, doc) {
		if(err) {
			return console.error(err);
		} else {
			success = doc != null;
			if(success) {
				console.log('%s %s %d %d', doc.name, id, doc.visits, num);
				newVisits = doc.visits + 1;
				opts = {
					tpl: 'success',
					id: id,
					name: doc.name,
					visits: num,
					timeframe: config.modules.controller.recentVisitLabel
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
}

var actions = {};

var legalConfigProperties = ['accessPeriod', 'accessAmount', 'recentVisitTimeframe',
		'recentVisitLabel', 'dispenseTime'];
actions[config.mqtt.topics.config] = function(topic, options) {
	// handle config message
	try {
        var message = JSON.parse(options);
    } catch(err) {
        // do nothing if parsing fails
        // todo: log
        console.error('Invalid JSON: ' + options);
        return;
    }
    
    _.each(legalConfigProperties, function(prop) {
    	if(message.hasOwnProperty(prop)) {
    		config.modules.controller[prop] = message[prop];
    	}
    });
    console.log('%d, %s', config.modules.controller.accessAmount, config.modules.controller.recentVisitLabel);
};

actions[config.mqtt.topics.reader] = function(topic, id) {
	// handle rfid from reader
	act(id);
};

client.on('message', function(topic, message) {
	var action = actions[topic];
	if(action) {
		action(topic, message);
	}		
});