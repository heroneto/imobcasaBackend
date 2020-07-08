'use strict';
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../../.env')})


module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullName: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    admin: DataTypes.BOOLEAN
  }, {
    freezeTableName: true,
    hooks: {
        beforeCreate: (user) => {
          const salt = bcrypt.genSaltSync()
          user.password = bcrypt.hashSync(user.password, salt)
        }
      },
  })
  User.prototype.validPassword = async function(password) {
    return await bcrypt.compareSync(password, this.password)
  }
  User.prototype.generateToken = async function(id, username) {
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
      expiresIn: process.env.NODE_ENV === 'production' ? '1d' : '1m',
    });
    return token
  }
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Leads, {
      foreignKey: 'userid'
    })
  };
  return User;
};