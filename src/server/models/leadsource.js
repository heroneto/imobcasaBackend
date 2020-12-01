'use strict';
module.exports = (sequelize, DataTypes) => {
  const leadSource = sequelize.define('leadSource', {
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {});
  leadSource.associate = function(models) {
    // associations can be defined here
  };
  return leadSource;
};