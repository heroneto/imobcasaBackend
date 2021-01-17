'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tokens = sequelize.define('Tokens', {
    fb_marketing_token: DataTypes.STRING
  }, {});
  Tokens.associate = function(models) {
    // associations can be defined here
  };
  return Tokens;
};