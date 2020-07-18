'use strict';
module.exports = (sequelize, DataTypes) => {
  const Leadstatus = sequelize.define('leadstatuses', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Leadstatus.associate = function(models) {
    // associations can be defined here
  };
  return Leadstatus;
};