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
    mongodb: {
        url: 'mongodb://winter.ceit.uq.edu.au:27017/gumball'
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
};