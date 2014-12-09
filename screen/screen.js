var mqtt = require('mqtt');
var LCD = require('./lcd');
var template = require('./template.js')('./templates/', LCD);

var config = require('./config.js');
client = mqtt.createClient(config.port, config.host);

client.subscribe(config.topic);
client.on('message', function(topic, rawMessage) {
    // ignore off-topic messages
	if(topic != config.topic) {
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

    template.run(tpl, {name: "Ben"});
});


