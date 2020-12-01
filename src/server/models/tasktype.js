'use strict';
const { v4: uuidV4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
  const tasktype = sequelize.define('tasktype', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    hooks: {
      beforeCreate: (user) => {
        tasktype.id = uuidV4()
      }
    }
  });
  tasktype.associate = function (models) {
    // associations can be defined here
  };
  return tasktype;
};