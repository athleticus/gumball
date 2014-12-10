var path = require('path'),
    rootPath = path.normalize(__dirname + '/webpanel'),
    env = process.env.NODE_ENV || 'development';

var mongoModels = path.normalize(__dirname + '/mongo/models');

module.exports = {
    mqtt: {
        url: 'mqtt://winter.ceit.uq.edu.au:1883',
        topics: {
            reader: 'mm-reader',
            screen: 'mm-screen',
            //dispenser: 'mm-dispenser'
            dispenser: 'ait',
        }
    },
    mongo: {
        url: 'mongodb://winter.ceit.uq.edu.au:27017/gumball',
        models: mongoModels
    },
    modules: {
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
        port: 3000,
        app: {
            name: 'webpanel'
        }
    }
};