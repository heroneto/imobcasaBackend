'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('leadSources', [
      {
        name: "Manual",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
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
