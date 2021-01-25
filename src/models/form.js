'use strict';
const { v4: uuidV4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
  const Form = sequelize.define('Forms', {
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    fbCreatedDate: DataTypes.DATE,
    fbFormId: DataTypes.STRING,
  }, {
    hooks: {
      beforeCreate: (Form) => {
        Form.id = uuidV4()
      }
    }
  });
  Form.associate = function(models) {
    // associations can be defined here
  };
  return Form;
};