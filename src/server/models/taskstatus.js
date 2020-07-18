'use strict';
module.exports = (sequelize, DataTypes) => {
  const taskstatus = sequelize.define('taskstatus', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  taskstatus.associate = function(models) {
    // associations can be defined here
  };
  return taskstatus;
};