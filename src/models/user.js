'use strict';
var bcrypt = require('bcrypt');


module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    manager: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync()
        user.password = bcrypt.hashSync(user.password, salt)
      }
    },
  });
  User.prototype.validPassword = async function(password) {
    return await bcrypt.compareSync(password, this.password)
  }
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};