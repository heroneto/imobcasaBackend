'use strict';
module.exports = (sequelize, DataTypes) => {
  const tasktype = sequelize.define('tasktype', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {});
  tasktype.associate = function(models) {
    // associations can be defined here
  };
  return tasktype;
};