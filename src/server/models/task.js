'use strict';
module.exports = (sequelize, DataTypes) => {
  const task = sequelize.define('task', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    userid: DataTypes.INTEGER,
    leadid: DataTypes.INTEGER,
    statusid: DataTypes.INTEGER,
    startdate: DataTypes.DATE,
    resolutiondate: DataTypes.DATE,
    tasktypeid: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
  }, {});
  task.associate = function(models) {
    // associations can be defined here
  };
  return task;
};