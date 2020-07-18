'use strict';
module.exports = (sequelize, DataTypes) => {
  const Leads = sequelize.define('Leads', {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    source: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    statusId: DataTypes.INTEGER
  }, {});
  Leads.associate = function(models) {
    // associations can be defined here
    Leads.belongsTo(models.User, {
      foreignKey: {
        name: 'id',
        type: DataTypes.INTEGER
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }),
    Leads.hasOne(models.Status, {
      foreignKey: {
        name: 'id',
        type: DataTypes.INTEGER
      },
      onDelete: 'CASCADE',
      onDelete: 'CASCADE'
    })
  };
  return Leads;
};