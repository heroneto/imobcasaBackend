'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      userid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
      },
      leadid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'leads',
          key: 'id'
        },
      },
      statusid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'taskstatuses',
          key: 'id'
        },
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