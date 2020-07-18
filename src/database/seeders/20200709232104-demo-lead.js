'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('Leads', [{
    name: "Demo Lead",
    phone: "112222233333",
    source: "Facebook",
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date,
    statusId: 1
  }], {});
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Leads', null, {});
  }
};
