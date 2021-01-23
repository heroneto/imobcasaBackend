'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('usersForms', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      formid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Forms",
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
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    return queryInterface.dropTable('usersForms');
  }
};