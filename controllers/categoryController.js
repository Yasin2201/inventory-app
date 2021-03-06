var Category = require('../models/category');
var Item = require('../models/item');
var async = require('async');
var { body, validationResult } = require('express-validator');

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
    res.render('category_form', { title: 'Create Category', category: undefined })
}

// Handle Category Create on POST
exports.category_create_post = [
    // validate and sanitize category fields
    body('category_name').trim().isLength({ min: 1 }).escape().withMessage('Category name can not be blank.'),
    body('category_description').trim().isLength({ min: 1 }).escape().withMessage('Category Description can not be blank.'),

    //Process request after validation & sanitization
    (req, res, next) => {

        //Errors from request
        const errors = validationResult(req)

        //Create category with trimmed and escaped data
        var category = new Category({
            category_name: req.body.category_name,
            category_description: req.body.category_description
        });

        // // if req errors is not empty then re-render form with santized value/error messages
        if (!errors.isEmpty()) {
            res.render('category_form', { title: 'Create Category', category: category, errors: errors.array() });
            return;
        }
        else {
            //First check if category name already exists
            Category.findOne({ 'category_name': req.body.category_name })
                .exec(function (err, found_category) {
                    if (err) { return next(err) }

                    // if category already exists redirect to category page
                    if (found_category) {
                        res.redirect(found_category.url)
                    }
                    //else save new category then redirect to new category page
                    else {
                        category.save(function (err) {
                            if (err) { return next(err) }
                            res.redirect('/categories');
                        });
                    }
                });
        }
    }
]

// Display Category Delete form on GET
exports.category_delete_get = function (req, res, next) {
    // GET category and items data
    async.parallel({
        category: function (callback) {
            Category.findById(req.params.id).exec(callback)
        },
        items: function (callback) {
            Item.find({ 'item_category': req.params.id }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err) }
        // if category doesn't exist throw err
        if (results.category === null) {
            var error = new Error("Category Not Found")
            error.status = 404
            return next(err)
        }
        // SUCCESS render delete page and display category and item info
        res.render('category_delete', { title: 'Delete Category', category: results.category, items: results.items })
    })
}

// Handle Category Delete on POST
exports.category_delete_post = function (req, res, next) {

    // Get category and items information
    async.parallel({
        category: function (callback) {
            Category.findById(req.params.id).exec(callback)
        },
        items: function (callback) {
            Item.find({ 'item_category': req.params.id }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err) }
        //Successfull
        else {
            // delete all items with a item_category value that matches id of category being deleted 
            Item.deleteMany({ 'item_category': results.category._id }, function (err) { })

            // find category by id and delete
            Category.findByIdAndRemove(req.body.categoryid, function deleteCategory(err) {
                if (err) { return next(err) }
                res.redirect('/categories')
            })
        }
    })
}

// Display Category Update form on GET
exports.category_update_get = function (req, res, next) {
    // find category that will be update and populate update form with category info
    Category.findById(req.params.id)
        .exec(function (err, category) {
            if (err) { return next(err) }
            res.render('category_form', { title: 'Update Category', category: category });
        });
}

// Handle Category Update on POST
exports.category_update_post = [
    // validate and sanitize category fields
    body('category_name').trim().isLength({ min: 1 }).escape().withMessage('Category name can not be blank.'),
    body('category_description').trim().isLength({ min: 1 }).escape().withMessage('Category Description can not be blank.'),

    (req, res, next) => {
        const errors = validationResult(req);

        // set update category details as those specified in update category form
        var category = new Category({
            category_name: req.body.category_name,
            category_description: req.body.category_description,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            // if error re-render category with list of error messages
            res.render('category_form', { title: 'Update Category', category: category, errors: errors.array() });
            return;
        } else {
            // successful redirect to update category detail page
            Category.findByIdAndUpdate(req.params.id, category, {}, function (err) {
                if (err) { return next(err) }
                res.redirect('/categories')
            })
        }
    }
]
