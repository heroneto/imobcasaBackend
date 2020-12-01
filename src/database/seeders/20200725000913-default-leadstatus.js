'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('leadstatuses', [
    {
      name: 'Aguardando',
      description: 'O Lead está aguardando seu retorno, não há tarefas abertas para este Lead',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Negociação em andamento',
      description: 'A negocaiação deste Lead está em andamento',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Negociação concluída',
      description: 'A negociação deste Lead foi concluída com sucesso',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Arquivado',
      description: 'Este Lead está arquivado.',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {});
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('leadstatuses', null, {});
  }
};
