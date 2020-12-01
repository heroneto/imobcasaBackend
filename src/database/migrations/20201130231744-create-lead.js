'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('leads', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        unique: true
      },
      sourceid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "leadSources",
          key: "id"
        }
      },
      campaignid: {
        type: Sequelize.UUID,
        references: {
          model: "Campaigns",
          key: "id"
        }
      },
      userid: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      statusid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'leadstatuses',
          key: 'id'
        }
      },
      negociationStartedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      negociationCompletedAt: {
        allowNull: true,
        type: Sequelize.DATE
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
    return queryInterface.dropTable('leads');
  }
};