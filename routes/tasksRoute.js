const route = require('express').Router();
const tasksController = require('../controllers/tasksController.js');

route.post('/', tasksController.create);
route.get('/', tasksController.read);
route.put('/:id', tasksController.update);
route.delete('/:id', tasksController.delete);

module.exports = route;