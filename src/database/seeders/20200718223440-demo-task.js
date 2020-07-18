'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.bulkDelete('tasks', null, {}),
        queryInterface.bulkInsert('tasks', [
          {
            title: 'Demo task title',
            description: 'Demo task description',
            userid: 1,
            leadid: 1,
            statusid: 1,
            startdate: new Date(),
            resolutiondate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            tasktypeid: 1
          }
        ], {})
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tasks', null, {});
  }
};
