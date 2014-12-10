var ref = require('reflektorjs');
var mqtt = require('mqtt');

var config = require('../config.js');

client = mqtt.connect(config.mqtt.url);

ref.on('hide', function(id){
	client.publish(config.mqtt.topics.reader, id);
});
