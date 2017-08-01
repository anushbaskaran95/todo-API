var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var app = express();
var port = process.env.PORT || 3000;
var todos = [];
var nextItem = 1;
var db = require('./db.js');

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Hello! to-do API test page!');
});

// GET /todos?completed=x //queryParameter returns {completed: 'true'} where true is a string -> not bool
app.get('/todos', function(req, res) {
	var queryParameter = req.query;
	var where = {};

	if (queryParameter.hasOwnProperty('completed') && queryParameter.completed === 'true')
		where.completed = true;
	else if (queryParameter.hasOwnProperty('completed') && queryParameter === 'false')
		where.completed = false;

	if (queryParameter.hasOwnProperty('q') && queryParameter.q.length > 0) {
		where.description = {
			$like: '%' + queryParameter.q + '%'
		};
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		if (todos.length > 0) {
			res.json(todos);
		} else {
			res.status(404).send('Item not found');
		}
	}, function() {
		res.status(500).send();
	});
	// var filteredTodos = todos;

	// if (queryParameter.hasOwnProperty('completed') && queryParameter.completed === 'true')
	// 	filteredTodos = _.where(todos, {
	// 		completed: true
	// 	});
	// else if (queryParameter.hasOwnProperty('completed') && queryParameter.completed === 'false')
	// 	filteredTodos = _.where(todos, {
	// 		completed: false
	// 	});

	// if (queryParameter.hasOwnProperty('q') && queryParameter.q.length > 0) {
	// 	filteredTodos = _.filter(filteredTodos, function(todo) {
	// 		return todo.description.toLowerCase().indexOf(queryParameter.q.toLowerCase()) >= 0;
	// 	});
	// }

	//res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var idNumber = parseInt(req.params.id, 10);

	db.todo.findById(idNumber).then(function(todo) {
		if (!!todo) //convert an object or NULL to truth version
			res.json(todo.toJSON());
		else
			res.status(404).send('Item not found!');
	}, function() {
		res.send(500).send();
	});
	// var matchedItem = _.findWhere(todos, {
	// 	id: idNumber
	// });

	// if (typeof matchedItem !== 'undefined')
	// 	res.json(matchedItem);
	// else
	// 	res.status(404).send('Item not found');
});

// POST /todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(error) {
		res.status(400).json(error);
	});

	// if (!_.isBoolean(body.completed))
	// 	res.status(400).send('Completed Status - Incorrect Field Type');
	// else if (!_.isString(body.description))
	// 	res.status(400).send('Description - Incorrect Field Type');
	// else if (body.description.trim().length === 0)
	// 	res.status(400).send('Invalid Description');
	// else {
	// 	body.description = body.description.trim();
	// 	//adding an ID
	// 	body.id = nextItem++;

	// 	//adding it to the list of todos
	// 	todos.push(body);

	// 	res.json(body);
	// }
});

// DELETE /todos/:id

app.delete('/todos/:id', function(req, res) {
	var idToDelete = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: idToDelete
		}
	}).then(function(rowsDeleted) {
		if(rowsDeleted === 0)
			res.status(404).json({
				error: 'item not found'
			});
		else
			res.status(204).send();
	}, function() {
		res.status(500).send();
	});

	// var matchedItem = _.findWhere(todos, {
	// 	id: idToDelete
	// });

	// if (typeof matchedItem != 'undefined') {
	// 	todos = _.without(todos, matchedItem);
	// 	res.json(matchedItem);
	// } else
	// 	res.status(404).json({
	// 		"error": "Item not found"
	// 	});
});

// PUT /todos/:id

app.put('/todos/:id', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	var idToFind = parseInt(req.params.id, 10);
	var attributes = {};

	if(body.hasOwnProperty('completed'))
		attributes.completed = body.completed;
	if(body.hasOwnProperty('description'))
		attributes.description = body.description;

	db.todo.findById(idToFind).then(function(todo) {
		if(!!todo) {
			todo.update(attributes).then(function(todo) {
				res.json(todo.toJSON());
			}, function(error) {
				res.status(400).json(error);
			});
		} else {
			res.status(404).send('Item not found');
		}
	}, function() {
		res.status(500).send();
	});

	// var matchedObject = _.findWhere(todos, {
	// 	id: idToFind
	// });
	// var updatedAttributes = {};

	// if (typeof matchedObject === 'undefined')
	// 	return res.status(404).send('object not found');

	// if (body.hasOwnProperty('completed') && _.isBoolean(body.completed))
	// 	updatedAttributes.completed = body.completed;
	// else if (body.hasOwnProperty('completed'))
	// 	return res.send(400).send('Incorrect Data Type - Completed');

	// if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0)
	// 	updatedAttributes.description = body.description.trim();
	// else if (body.hasOwnProperty('description'))
	// 	return res.send(400).send('Incorrect Data Type - Description');

	// _.extend(matchedObject, updatedAttributes);
	// res.json(matchedObject);
});

db.sequelize.sync().then(function() {
	app.listen(port, function() {
		console.log('to-do API server started at port: ' + port);
	});
});