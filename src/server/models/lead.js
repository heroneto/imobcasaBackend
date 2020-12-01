'use strict';
module.exports = (sequelize, DataTypes) => {
  const lead = sequelize.define('lead', {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    sourceid: DataTypes.INTEGER,
    campaignid: DataTypes.INTEGER,
    userid: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    statusid: DataTypes.INTEGER,
    negociationStartedAt: DataTypes.DATE,
    negociationCompletedAt: DataTypes.DATE
  }, {});
  lead.associate = function(models) {
    // associations can be defined here
  };
  return lead;
};