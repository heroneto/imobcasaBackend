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
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Campaigns",
          key: "id"
        }
      },
      userid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        }
      },
      lastLeadReceivedTime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: true,
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