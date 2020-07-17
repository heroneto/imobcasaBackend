'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   return queryInterface.bulkInsert('Statuses', [
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
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('Statuses', null, {});
  }
};
