#! /usr/bin/env node
console.log('This script populates some categories and items to your database. Specified database as argument - e.g.: populatedb mongodb+srv://inventory-user:InventoryPass123@cluster0.qmggi.mongodb.net/inventory-app?retryWrites=true&w=majority');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Category = require('./models/category')
var Item = require('./models/item')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = []
var items = []

function categoryCreate(category_name, category_description, cb) {
    categoryDetail = { category_name: category_name, category_description: category_description }

    var category = new Category(categoryDetail)

    category.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log(`New Category: ${category}`)
        categories.push(category)
        cb(null, category)
    });
}

function itemCreate(item_name, item_description, item_category, item_price, item_stock, cb) {
    itemDetail = { item_name: item_name, item_description: item_description, item_category: item_category, item_price: item_price, item_stock: item_stock }

    var item = new Item(itemDetail)

    item.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log(`New Item: ${item}`)
        items.push(item)
        cb(null, item)
    });
}

function createCategoryAndItem(cb) {
    async.series([
        function (callback) {
            categoryCreate('Chairs', 'Beautiful chairs for any environment', callback)
        },
        function (callback) {
            categoryCreate('Tables', 'A Range of tables perfect for you', callback)
        },
        function (callback) {
            itemCreate('Recliner', 'A comfy recliner to relax in', categories[0], 29.99, 5, callback)
        },
        function (callback) {
            itemCreate('Rocking', 'The perfect chair to read your favourite book', categories[0], 49.99, 2, callback)
        },
        function (callback) {
            itemCreate('Dining Table', 'Enjoy your favourite meals on your favourite table', categories[1], 129.99, 1, callback)
        }
    ], cb)
}

async.series([
    createCategoryAndItem
],
    // Optional callback
    function (err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        }
        // All done, disconnect from database
        mongoose.connection.close();
    });



