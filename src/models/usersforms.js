'use strict';
const { v4: uuidV4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
  const usersForms = sequelize.define('usersForms', {
    formid: DataTypes.UUID,
    userid: DataTypes.UUID,
    lastLeadReceivedTime: DataTypes.DATE,
    score: DataTypes.INTEGER,
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    hooks: {
      beforeCreate: (usersForms) => {
        usersForms.id = uuidV4()
        usersForms.lastLeadReceivedTime = Date.now()
      }
    }    
  });
  usersForms.associate = function(models) {
    // associations can be defined here
  };
  return usersForms;
};