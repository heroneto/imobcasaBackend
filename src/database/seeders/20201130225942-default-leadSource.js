'use strict';
const { v4:uuidV4 } = require('uuid')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('leadSources', [
      {
        id: uuidV4(),
        name: "Manual",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidV4(),
        name: "Facebook",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('leadSources', null, {});
  }
};
