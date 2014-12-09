var fs = require('fs'),
    S = require('string'),
    path = require('path');

var tplEnd = '.js';

module.exports = function(dir, context) {
    // get all templates in file
    var files = fs.readdirSync(dir);
    var templates = {};

    dir = path.resolve(dir);

    if(!files) {
        throw new Error('Error reading directory: ' + dir);
    }

    files.forEach(function(file) {
        if(!S(file).endsWith(tplEnd)) {
            // ignore non-template files
            return;
        }

        name = file.slice(0, -tplEnd.length);

        templates[name] = require(path.join(dir, file));
    });

    return {
        run: function(name, options) {
            templates[name].call(context, options);
        },
        exists: function(name) {
            return !!templates[name];
        }
    };
};
