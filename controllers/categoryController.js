var Category = require('../models/category');
var Item = require('../models/item');
var async = require('async');

// Display Home Page
exports.index = function (req, res) {
    res.render('index', { title: 'Furniture For You', url: '/categories' })
};

// Display list of all categories
exports.category_list = function (req, res, next) {
    Category.find()
        .exec(function (err, list_categories) {
            if (err) { return next(err) }
            res.render('category_list', { title: 'All Categories', category_list: list_categories });
        });
}

// Display Details of categories
exports.category_detail = function (req, res, next) {
    async.parallel({
        category: function (callback) {
            Category.findById(req.params.id)
                .exec(callback)
        },
        category_items: function (callback) {
            Item.find({ 'item_category': req.params.id })
                .exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.category === null) {
            var err = new Error('Category Not Found');
            err.status = 404;
            return next(err)
        }
        res.render('category_detail', { title: results.category.category_name, category: results.category, category_items: results.category_items });
    })
}

// Display Category Create form on GET
exports.category_create_get = function (req, res) {
    res.send('Not Implemented: Category Create GET')
}

// Handle Category Create on POST
exports.category_create_post = function (req, res) {
    res.send('Not Implemented: Category Create POST')
}

// Display Category Delete form on GET
exports.category_delete_get = function (req, res) {
    res.send('Not Implemented: Category Delete GET')
}

// Handle Category Delete on POST
exports.category_delete_post = function (req, res) {
    res.send('Not Implemented: Category Delete POST')
}

// Display Category Update form on GET
exports.category_update_get = function (req, res) {
    res.send('Not Implemented: Category Update Get')
}

// Handle Category Update on POST
exports.category_update_post = function (req, res) {
    res.send('Not Implemented: Category Update POST')
}
