'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tasktypes', [
      {
        name: 'Cobrar cliente',
        description: 'Cobrar o cliente referente à uma atualização',
        active: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Retornar para o cliente',
        description: 'Retornar o contato para o cliente',
        active: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Enviar doc/foto/vídeo',
        description: 'Envio de documentação do cliente',
        active: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Visita agendada',
        description: 'Vísita agendada com o cliente',
        active: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tasktypes', null, {});
  }
};
