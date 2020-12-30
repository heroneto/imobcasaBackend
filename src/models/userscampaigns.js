'use strict';
const { v4: uuidV4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
  const usersCampaigns = sequelize.define('usersCampaigns', {
    campaignid: DataTypes.UUID,
    userid: DataTypes.UUID,
    lastLeadReceivedTime: DataTypes.DATE,
    score: DataTypes.INTEGER,
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    hooks: {
      beforeCreate: (usersCampaigns) => {
        usersCampaigns.id = uuidV4()
        usersCampaigns.lastLeadReceivedTime = Date.now()
      }
    }    
  });
  usersCampaigns.associate = function(models) {
    // associations can be defined here
  };
  return usersCampaigns;
};