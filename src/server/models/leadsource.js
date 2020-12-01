'use strict';
const { v4: uuidV4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
  const leadSource = sequelize.define('leadSource', {
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    hooks: {
      beforeCreate: (user) => {
        leadSource.id = uuidV4()
      }
    }
  });
  leadSource.associate = function(models) {
    // associations can be defined here
  };
  return leadSource;
};