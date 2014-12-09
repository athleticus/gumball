var exec = require('exec');

module.exports = {
    write_text: function(text) {
        args = ['python', 'screen.py'].concat(text);

        exec(args, function(err, out, code){
            if(!err) {
                return;
            }
            console.error("Ran screen.py with: ", err, out, code);
        });
    }
};