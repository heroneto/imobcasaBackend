'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.sequelize.transaction((t) => {
     return Promise.all([
       queryInterface.renameTable('statuses', 'leadstatuses', {transaction: t})
     ])
   })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.renameTable('leadstatuses', 'statuses', {transaction: t})
      ])
    })
  }
};
