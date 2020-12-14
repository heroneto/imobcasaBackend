'use strict';
const { v4: uuidV4 } = require('uuid')
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
  }, {
    hooks: {
      beforeCreate: (lead) => {
        lead.id = uuidV4()
      }
    }
  });
  lead.associate = function(models) {
    // associations can be defined here
  };
  return lead;
};