'use strict';
const { v4:uuidV4 } = require('uuid')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Forms', [
      {
        id: uuidV4(),
        name: 'Penha',
        active: 1,
        fbCreatedDate: new Date(),
        fbFormId: "_123IDteste",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Forms');
  }
};
