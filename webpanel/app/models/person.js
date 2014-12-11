module.exports = function(mongoose) {
    var Schema = mongoose.Schema;

    var PersonSchema = new Schema({
        rfid: String,
        name: String,
        visits: {
            type: Number,
            default: 0
        }
    });

    return mongoose.model('person', PersonSchema);
}
