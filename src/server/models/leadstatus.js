'use strict';
module.exports = (sequelize, DataTypes) => {
  const leadstatus = sequelize.define('leadstatus', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  leadstatus.associate = function(models) {
    // associations can be defined here
  };
  return leadstatus;
};