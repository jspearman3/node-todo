var mongoose = require('mongoose');

module.exports = mongoose.model('Food', {
    text: {
        type: String,
        default: ''
    },

    price: {
        type: Number,
        default: 0.0
    }
});