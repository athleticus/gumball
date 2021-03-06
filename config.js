var path = require('path'),
    rootPath = path.normalize(__dirname + '/webpanel'),
    env = process.env.NODE_ENV || 'development';

module.exports = {
    mqtt: {
        //url: 'mqtt://winter.ceit.uq.edu.au:1883',
        url: 'mqtt://gumball:password@localhost:1883',
	topics: {
            reader: 'mm-reader',
            screen: 'mm-screen',
            dispenser: 'mm-dispenser',
            config: 'mm-config'
        }
    },
    mongo: {
        url: 'mongodb://winter.ceit.uq.edu.au:27017/gumball'
    },
    modules: {
    	controller: {
    		'accessPeriod' : 300000, //5 minutes
        	'accessAmount' : 2,
        	'recentVisitTimeframe' : 604800000, //1 week
        	'recentVisitLabel' : "week",
        	'dispenseTime' : 1000
    	},
        dispenser: {
        },
        reader: {
        },
        screen: {
            'maxLineWidth': 20
        }
    },
    webpanel: {
        root: rootPath,
        port: 13337,
        app: {
            name: 'Gumby'
        }
    }
};
