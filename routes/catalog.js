var express = require('express');
var router = express.Router();

// Controller modules
var category_controller = require('../controllers/categoryController');
var item_controller = require('../controllers/itemController');

// CATEGORY ROUTES //
// Home page
router.get('/', category_controller.index);

// GET request to create a Category 
router.get('/category/create', category_controller.category_create_get)

// POST request for creating Category
router.post('/category/create', category_controller.category_create_post)

// GET request to delete a Category
router.get('/category/:id/delete', category_controller.category_delete_get)

// POST request for deleting Category
router.post('/category/:id/delete', category_controller.category_delete_post)

// GET request to update a Category
router.get('/category/:id/update', category_controller.category_update_get)

// POST request for updating Category
router.post('/category/:id/update', category_controller.category_update_post)

//GET request to list all items in Category
router.get('/category/:id', category_controller.category_detail)

// GET request to list all Categories
router.get('/categories', category_controller.category_list)

// ITEM ROUTES //
// GET request to create a Category 
router.get('/item/create', item_controller.item_create_get)

// POST request for creating Category
router.post('/item/create', item_controller.item_create_post)

// GET request to delete a Category
router.get('/item/:id/delete', item_controller.item_delete_get)

// POST request for deleting Category
router.post('/item/:id/delete', item_controller.item_delete_post)

// GET request to update a Category
router.get('/item/:id/update', item_controller.item_update_get)

// POST request for updating Category
router.post('/item/:id/update', item_controller.item_update_post)

//GET request for a single item
router.get('/item/:id', item_controller.item_detail)

// GET request to list all Categories
router.get('/items', item_controller.item_list)

module.exports = router;