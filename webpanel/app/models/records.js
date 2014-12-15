module.exports = function(mongoose) {
    var Schema = mongoose.Schema;

    var recordsSchema = new Schema({
        rfid: String,
        timestamp: {type: Date, default: Date.now}
    });

    return mongoose.model('records', recordsSchema);
}
