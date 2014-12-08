var ref = require('reflektorjs');
var mqtt = require('mqtt');

var config = require('./config.js');

client = mqtt.createClient(config.port, config.host);

ref.on('hide', function(id){
	client.publish(config.topic, id);
});
