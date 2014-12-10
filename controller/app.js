var mqtt = require('mqtt'),
    _ = require('underscore');
var config = require('./config.js');

var client = mqtt.createClient(config.port, config.host);

_.each(config.modules, function(topic, index) {
	client.subscribe(topic);
});

var ids = {
	'64217f0200000000': 'Ben',
	'42d6c3a00000000': 'Lucas',
	'446779900000000': 'Matt'
};

var act = function(id) {
	var name = ids[id];
	var success = !!name;
	var tpl, opts;

	if(success) {
		opts = {
			tpl: 'success',
			id: id,
			name: name
		};
	} else {
		opts = {
			tpl: 'fail',
			id: id
		};
	}

	// todo: broadcast to screen
	client.publish(config.modules.screen, JSON.stringify(opts));

	// todo: broadcast to dispenser
	if(success) {
		client.publish(config.modules.dispenser, 'yolo');
	}
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