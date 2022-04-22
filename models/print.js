const mongoose = require('mongoose');

const printSchema = new mongoose.Schema({
    name: String,
    Artist: String,
    url: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

module.exports = mongoose.model('Print', printSchema);