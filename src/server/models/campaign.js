'use strict';
module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define('Campaign', {
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    fbCreatedDate: DataTypes.DATE,
    fbCampaignId: DataTypes.STRING,
    fbAdAccountId: DataTypes.STRING
  }, {});
  Campaign.associate = function(models) {
    // associations can be defined here
  };
  return Campaign;
};