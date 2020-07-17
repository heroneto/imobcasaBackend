'use strict';

const { query } = require("express");

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.sequelize.transaction((t) => {
     return Promise.all([
       queryInterface.addColumn('Leads', 'statusId', {
        type: Sequelize.INTEGER,
        references: {
         model: 'Statuses',
         key: 'id'
        }
       }, {transaction: t})
      ])
   })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Leads', 'statusId', {transaction: t})
      ])
    })
  }
};
