var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var _ = require('underscore');
var todos = [];
var nextItem = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Hello! to-do API test page!');
});

// GET /todos
app.get('/todos', function(req, res) {
	res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var idNumber = parseInt(req.params.id, 10);

	var matchedItem = _.findWhere(todos, {id: idNumber});

	if(typeof matchedItem !== 'undefined')
		res.json(matchedItem);
	else
		res.status(404).send('Item not found');
});

// POST /todos
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	if(!_.isBoolean(body.completed))
		res.status(404).send('Completed Status - Incorrect Field Type');
	else if(!_.isString(body.description))
		res.status(404).send('Description - Incorrect Field Type');
	else if(body.description.trim().length === 0)
		res.status(404).send('Invalid Description');
	else 
	{
		body.description = body.description.trim();
		//adding an ID
		body.id = nextItem++;
	
		//adding it to the list of todos
		todos.push(body);

		res.json(body);
	}
});

// DELETE /todos/:id

app.delete('/todos/:id', function (req, res) {
	var idToDelete = parseInt(req.params.id, 10);
	var matchedItem = _.findWhere(todos, {id: idToDelete});

	if(typeof matchedItem != 'undefined')
	{
		todos = _.without(todos, matchedItem);
		res.json(matchedItem);
	}
	else
		res.status(404).json({"error": "Item not found"});
});


app.listen(port, function () {
	console.log('to-do API server started at port: ' + port);
});