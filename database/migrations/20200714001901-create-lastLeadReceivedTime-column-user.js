'use strict';

const { query } = require("express");

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.sequelize.transaction((t) => {
     return Promise.all([
       queryInterface.addColumn('User', 'lastLeadReceivedTime', {
        type: Sequelize.DATE,
       }, {transaction: t})
      ])
   })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('User', 'lastLeadReceivedTime', {transaction: t})
      ])
    })
  }
};
