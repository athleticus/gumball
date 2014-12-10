var mqtt = require('mqtt'),
    _ = require('underscore');

// connect to mongodb    
var mongoose = require('mongoose');    
mongoose.connect('mongodb://winter.ceit.uq.edu.au:27017/gumball');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//create model
var ds = mongoose.Schema({
	rfid: String,
	name: String,
	visits: {type: Number, default: 0}
});

var person = mongoose.model('person', ds);

var config = require('./config.js');

var client = mqtt.createClient(config.port, config.host);

_.each(config.modules, function(topic, index) {
	client.subscribe(topic);
});

// temp create accounts
//var matt = new person({rfid : '446779900000000', name: 'Matthew', visits : 0});
//matt.save(function (err, matt) { if(err) return console.error(err)});
//var ben = new person({rfid : '64217f0200000000', name: 'Ben', visits : 0});
//ben.save(function (err, matt) { if(err) return console.error(err)});

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
			client.publish(config.modules.screen, JSON.stringify(opts));
			//client.publish(config.modules.dispenser, 'yolo');			
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