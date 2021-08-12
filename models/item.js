var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    item_name: { type: String, required: true, minLength: 1, maxLength: 100 },
    item_description: { type: String, required: true, minLength: 1, maxLength: 200 },
    item_category: { type: String, required: true, minLength: 1, maxLength: 100 },
    item_price: { type: Number, required: true },
    item_stock: { type: Number, required: true }
});

ItemSchema.virtual('url').get(function () {
    return '/category/item/' + this._id
})

module.exports = mongoose.model('Item', ItemSchema)