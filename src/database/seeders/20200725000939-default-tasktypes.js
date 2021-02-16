'use strict';
const { v4:uuidV4 } = require('uuid')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tasktypes', [
      {
        id: uuidV4(),
        name: 'Cobrar cliente',
        description: 'Cobrar o cliente referente à uma atualização',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Retornar para o cliente',
        description: 'Retornar o contato para o cliente',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Enviar doc/foto/vídeo',
        description: 'Envio de documentação do cliente',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidV4(),
        name: 'Visita agendada',
        description: 'Vísita agendada com o cliente',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tasktypes', null, {});
  }
};
