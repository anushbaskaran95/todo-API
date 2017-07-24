var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: 'cancel netflix before you leave',
	completed: false	
}, { 
	id: 2,
	description: 'get notes and coins for sriram',
	completed: false 
}, {
	id: 3,
	description: 'complete maths homework',
	completed: true
}];

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


app.listen(port, function () {
	console.log('to-do API server started at port: ' + port);
});