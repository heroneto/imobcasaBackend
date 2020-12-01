'use strict';
const { v4: uuidV4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define('Campaign', {
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    fbCreatedDate: DataTypes.DATE,
    fbCampaignId: DataTypes.STRING,
    fbAdAccountId: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (user) => {
        Campaign.id = uuidV4()
      }
    }
  });
  Campaign.associate = function(models) {
    // associations can be defined here
  };
  return Campaign;
};