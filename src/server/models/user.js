'use strict';
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const path = require('path')
const { v4: uuidV4 } = require('uuid')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('users', {    
    fullName: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    admin: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN
  }, {
    freezeTableName: true,
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync()
        user.password = bcrypt.hashSync(user.password, salt)
        user.id = uuidV4()
      }
    },
  });
  user.prototype.validPassword = async function (password) {
    return await bcrypt.compareSync(password, this.password)
  }
  user.prototype.generateToken = async function (id, admin) {
    const token = jwt.sign({ id, admin }, process.env.JWT_SECRET, {
      expiresIn: process.env.NODE_ENV === 'production' ? '1d' : '1m',
    });
    return token
  }
  user.associate = function (models) {
    // associations can be defined here
  };
  return user;
};