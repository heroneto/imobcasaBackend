'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Campaigns', [
      {
        name: 'Penha',
        active: 1,
        fbCreatedDate: new Date(),
        fbCampaignId: "_123IDteste",
        fbAdAccountId: "_123IDteste",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Campaigns');
  }
};
