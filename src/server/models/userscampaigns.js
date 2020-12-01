'use strict';
const { v4: uuidV4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
  const usersCampaigns = sequelize.define('usersCampaigns', {
    id: DataTypes.UUID,
    campaignid: DataTypes.UUID,
    userid: DataTypes.UUID,
    lastLeadReceivedTime: DataTypes.DATE,
    score: DataTypes.INTEGER,
  }, {
    beforeCreate: (usersCampaigns) => {
      usersCampaigns.id = uuidV4()
    }
  });
  usersCampaigns.associate = function(models) {
    // associations can be defined here
  };
  return usersCampaigns;
};