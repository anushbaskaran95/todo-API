var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('todo', {
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [5, 250]
			}
		},
		completed: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	}, {
		validate: {
			isDescriptionString: function() {
				if (!_.isString(this.description)) {
					throw new Error('Description only takes string');
				}
			},
			isCompletedBoolean: function() {
				if (!_.isBoolean(this.completed)) {
					throw new Error('Completed should be a boolean value');
				}
			}
		}
	});
};