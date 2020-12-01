'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('usersCampaigns', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      campaignid: {
        type: Sequelize.UUID
      },
      userid: {
        type: Sequelize.UUID
      },
      lastLeadReceivedTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('usersCampaigns');
  }
};