'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('taskstatuses', [
    {
      name: 'To do',
      description: 'Represents an item that is in the queue for execution',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Doing',
      description: 'Represents an item that is running',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Done',
      description: 'Represents an item that is completed',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {});
  },
  down: (queryInterface, Sequelize) => {
   return queryInterface.dropTable('taskstatuses');
  }
};
