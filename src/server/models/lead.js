'use strict';
module.exports = (sequelize, DataTypes) => {
  const lead = sequelize.define('lead', {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    source: DataTypes.STRING,
    userid: DataTypes.INTEGER,
    statusid: DataTypes.INTEGER
  }, {});
  lead.associate = function(models) {
    // associations can be defined here
  };
  return lead;
};