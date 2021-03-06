'use strict';
const { v4: uuidV4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
  const lead = sequelize.define('lead', {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    sourceid: DataTypes.UUID,
    formid: DataTypes.UUID,
    userid: DataTypes.UUID,
    active: DataTypes.BOOLEAN,
    statusid: DataTypes.INTEGER,
    negociationStartedAt: DataTypes.DATE,
    negociationCompletedAt: DataTypes.DATE
  }, {
    hooks: {
      beforeCreate: (lead) => {
        lead.id = uuidV4()
      }
    }
  });
  lead.associate = function(models) {
    // associations can be defined here
    //     User.belongsTo(models.Company, {foreignKey: 'companyId', as: 'company'})

    lead.belongsTo(models.LeadStatus, {foreignKey: 'statusid', as: "status"})
  };
  return lead;
};