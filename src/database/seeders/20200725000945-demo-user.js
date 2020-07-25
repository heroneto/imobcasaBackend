'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('users', [{
    username: 'demouser',
    fullName: 'Demo',
    admin: true,
    email: 'demo@mail.com',
    password: 'demo',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {});
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('users', null, {});
  }
};
