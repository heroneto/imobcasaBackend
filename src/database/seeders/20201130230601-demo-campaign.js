'use strict';
const { v4:uuidV4 } = require('uuid')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Campaigns', [
      {
        id: uuidV4(),
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
