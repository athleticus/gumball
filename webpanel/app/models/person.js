var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PersonSchema = new Schema({
    rfid: String,
    name: String,
    visits: {
        type: Number,
        default: 0
    }
});

mongoose.model('person', PersonSchema);
