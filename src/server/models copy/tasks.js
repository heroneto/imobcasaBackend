'use strict';
module.exports = (sequelize, DataTypes) => {
  const tasks = sequelize.define('tasks', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    userid: DataTypes.INTEGER,
    leadid: DataTypes.INTEGER,
    statusid: DataTypes.INTEGER,
    tasktypeid: DataTypes.INTEGER,
    startdate: DataTypes.DATE,
    resolutiondate: DataTypes.DATE
  }, {});
  tasks.associate = function(models) {
    tasks.hasOne(models.taskstatus, {
      foreignKey: {
        name: 'id',
        type: DataTypes.INTEGER
      }
    }),
    tasks.hasOne(models.tasktype, {
      foreignKey: {
        name: 'id',
        type: DataTypes.INTEGER
      }
    }),
    tasks.hasOne(models.User, {
      foreignKey: {
        name: 'id',
        type: DataTypes.INTEGER
      }
    }),
    tasks.hasOne(models.Leads, {
      foreignKey: {
        name: 'id',
        type: DataTypes.INTEGER
      }
    })
  };
  return tasks;
};