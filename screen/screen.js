var exec = require('exec');
var mqtt = require('mqtt');

var write_to_lcd = function(text) {
	args = ['python', 'screen.py'].concat(text);

	exec(args, function(){});
}

var config = require('./config.js');
client = mqtt.createClient(config.port, config.host);

client.subscribe(config.topic);
client.on('message', function(topic, message) {
	if(topic != config.topic) {
		return;
	}

	var text = message.split('\n').map(function(text){
		return text.substr(0, config.maxLineWidth);
	});

	write_to_lcd(text);	
});


