'use strict';

const { v4: uuidV4 } = require('uuid')


module.exports = (sequelize, DataTypes) => {
  const Tokens = sequelize.define('Tokens', {
    fb_marketing_token: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (token) => {
        token.id = uuidV4()
      }
    }
  });
  Tokens.associate = function(models) {
    // associations can be defined here
  };
  return Tokens;
};