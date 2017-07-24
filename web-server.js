var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
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
app.get('/todos/:id', function(req, res) {
	var idNumber = parseInt(req.params.id, 10);
	//console.log('Item Requested: ' + idNumber);
	var pageFound = -1;
	for(var i = 0; i < todos.length; i++)
	{
		if(todos[i].id === idNumber)
		{
			pageFound = 1;
			res.json(todos[i]);
			break;
		}
	}

	if(pageFound == -1)
		res.status(404).send('Page Not Found');
});

// POST /todos
app.post('/todos', function(req, res){
	var body = req.body;

	//adding an ID
	body.id = nextItem++;
	
	//adding it to the list of todos
	todos.push(body);

	res.json(body);
});


app.listen(port, function () {
	console.log('to-do API server started at port: ' + port);
});