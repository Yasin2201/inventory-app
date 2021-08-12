var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    category_name: { type: String, required: true, minLength: 1, maxLength: 100 },
    category_description: { type: String, required: true, minLength: 1, maxLength: 200 },
});

CategorySchema.virtual('url').get(function () {
    return '/category/' + this._id
})

module.exports = mongoose.model('Category', CategorySchema)