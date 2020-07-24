'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('tasks', 'tasktypeid', {
         type: Sequelize.INTEGER,
         references: {
           model: 'tasktypes',
           key: 'id'
         }
        }, {transaction: t})
       ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('tasks', 'tasktypeid', {transaction: t})
      ])
    })
  }
};
