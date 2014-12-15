process.chdir(__dirname);

var mqtt = require('mqtt');
var LCD = require('./lcd');
var template = require('./template.js')('./templates/', LCD);

var config = require('../config.js');
client = mqtt.connect(config.mqtt.url);

client.subscribe(config.mqtt.topics.screen);

client.on('message', function(topic, rawMessage) {
    // ignore off-topic messages
	if(topic != config.mqtt.topics.screen) {
		return;
	}

    // parse the message as json
    try {
        var message = JSON.parse(rawMessage);
    } catch(err) {
        // do nothing if parsing fails
        // todo: log
        console.error('Invalid JSON: ' + rawMessage);
        return;
    }

    var tpl = message.tpl;
    if(!tpl) {
        // handle undefined template
        // todo: log
        console.error('No template defined in message: ' + rawMessage);
        return;
    }

    if(!template.exists(tpl)) {
        // handle invalid template
        // todo: log 
        console.error('Invalid template: ' + tpl);
        return;
    }

    template.run(tpl, message);
});


