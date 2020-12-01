'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      userid: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        },
      },
      leadid: {
        type: Sequelize.UUID,
        references: {
          model: 'leads',
          key: 'id'
        },
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false 
      },
      startdate: {
        type: Sequelize.DATE
      },
      resolutiondate: {
        type: Sequelize.DATE
      },
      tasktypeid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tasktypes',
          key: 'id'
        },
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
    return queryInterface.dropTable('tasks');
  }
};