const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    rate: {type: String, required: true}
    //otros campos
});

module.exports = mongoose.model('Item', itemSchema);