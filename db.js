var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;
var _ = require('underscore');

if(env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		dialect: 'sqlite',
		storage: __dirname + '/data/todo-api.sqlite'
	});
}

var db = {};
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.user = sequelize.import(__dirname + '/models/user.js');

//instance method to make sure users cannot see password, salt and hash_password fields
db.user.prototype.toPublicJSON = function () {
	var json = this.toJSON();
	return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;