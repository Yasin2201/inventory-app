var Item = require('../models/item');
var Category = require('../models/category');
var async = require('async')
var { body, validationResult } = require('express-validator');

// Display list of all Items
exports.item_list = function (req, res) {
    res.send('Not Implemented: Item List')
}

// Display Details of Items
exports.item_detail = function (req, res) {
    Item.findById(req.params.id)
        .exec(function (err, item_detail) {
            if (err) { return next(err); }
            res.render('item_detail', { title: item_detail.item_name, item_detail: item_detail });
        });
}

// Display Item Create form on GET
exports.item_create_get = function (req, res, next) {

    Category.find({})
        .exec(function (err, categories) {
            if (err) { return next(err) }
            res.render('item_form', { title: 'Create Item', categories: categories, item: undefined })
        })
}

// Handle Item Create on POST
exports.item_create_post = [
    body('item_name').trim().isLength({ min: 1 }).escape().withMessage('Item Name must not be blank'),
    body('item_description').trim().isLength({ min: 1 }).escape().withMessage('Item description must not be blank'),
    body('item_category').trim().escape(),
    body('item_stock').trim().isLength({ min: 1 }).escape().withMessage('Item Stock must not be blank'),
    body('item_price').trim().isLength({ min: 1 }).escape().withMessage('Item Price must not be blank'),

    (req, res, next) => {
        const errors = validationResult(req);

        var item = new Item({
            item_name: req.body.item_name,
            item_description: req.body.item_description,
            item_category: req.body.item_category,
            item_stock: req.body.item_stock,
            item_price: req.body.item_price
        });

        if (!errors.isEmpty()) {

            //Get all available categories
            Category.find({})
                .exec(function (err, categories) {
                    if (err) { return next(err) }
                    res.render('item_form', { title: 'Create Item', categories: categories, errors: errors.array(), item: item })
                })
        }
        else {
            item.save(function (err) {
                if (err) { return next(err) }

                res.redirect(`/category/${item.item_category}`)
            })
        }
    }
]

// Display Item Delete form on GET
exports.item_delete_get = function (req, res, next) {
    Item.findById(req.params.id)
        .exec(function (err, item) {
            if (err) { return next(err) }

            if (item === null) {
                var error = new Error('Item Not Found')
                error.status = 404
                return next(error)
            }
            res.render('item_delete', { title: 'Delete Item', item: item })
        })
}

// Handle Item Delete on POST
exports.item_delete_post = function (req, res, next) {
    Item.findById(req.params.id)
        .exec(function (err, item) {
            if (err) { return next(err) }

            if (item === null) {
                res.render('item_delete', { title: 'Delete Item', item: item })
            }
            else {
                Item.findByIdAndRemove(req.body.itemid, function deleteItem(err) {
                    if (err) { return next(err) }
                    res.redirect(`/category/${item.item_category}`)
                })
            }
        })
}

// Display Item Update form on GET
exports.item_update_get = function (req, res) {

    async.parallel({
        item: function (callback) {
            Item.findById(req.params.id).exec(callback)
        },
        categories: function (callback) {
            Category.find().exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err) }
        res.render('item_form', { title: 'Update Item', item: results.item, categories: results.categories });
    })
}

// Handle Item Update on POST
exports.item_update_post = [
    body('item_name').trim().isLength({ min: 1 }).escape().withMessage('Item Name must not be blank'),
    body('item_description').trim().isLength({ min: 1 }).escape().withMessage('Item description must not be blank'),
    body('item_category').trim().escape(),
    body('item_stock').trim().isLength({ min: 1 }).escape().withMessage('Item Stock must not be blank'),
    body('item_price').trim().isLength({ min: 1 }).escape().withMessage('Item Price must not be blank'),

    (req, res, next) => {
        const errors = validationResult(req);

        var item = new Item({
            item_name: req.body.item_name,
            item_description: req.body.item_description,
            item_category: req.body.item_category,
            item_stock: req.body.item_stock,
            item_price: req.body.item_price,
            _id: req.params.id
        })
        if (!errors.isEmpty()) {
            res.render('item_form', { title: 'Update Item', item: item, errors: errors.array() });
            return;
        } else {
            Item.findByIdAndUpdate(req.params.id, item, {}, function (err, theitem) {
                if (err) { return next(err) }
                res.redirect(theitem.url)
            })
        }
    }
]
