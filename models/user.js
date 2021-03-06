var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		salt: {
			type: DataTypes.STRING
		},
		hashed_password: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [7, 15]
			},
			set: function(val) {
				var salt = bcrypt.genSaltSync(10);
				var hash = bcrypt.hashSync(val, salt);

				this.setDataValue('password', val);
				this.setDataValue('salt', salt);
				this.setDataValue('hashed_password', hash);
			}
		}
	}, {
		hooks: {
			beforeValidate: function (user, options) {
				if(typeof user.email === 'string')
				{
					user.email = user.email.toLowerCase();
				}
			}
		}
	});
};