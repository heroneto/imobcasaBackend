'use strict';
const { v4: uuidV4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
  const leadstatus = sequelize.define('leadstatus', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (user) => {
        leadstatus.id = uuidV4()
      }
    }
  });
  leadstatus.associate = function (models) {
    // associations can be defined here
  };
  return leadstatus;
};