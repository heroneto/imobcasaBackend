'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('User', [{
    username: 'demouser',
    fullName: 'Demo',
    admin: true,
    email: 'demo@mail.com',
    password: 'demo',
    createdAt: new Date(),
    updatedAt: new Date()
  }], {});
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('User', null, {});
  }
};
