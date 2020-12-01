'use strict';
const { v4:uuidV4 } = require('uuid')

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('leadstatuses', [
    {
      id: uuidV4(),
      name: 'Aguardando',
      description: 'O Lead está aguardando seu retorno, não há tarefas abertas para este Lead',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidV4(),
      name: 'Negociação em andamento',
      description: 'A negocaiação deste Lead está em andamento',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidV4(),
      name: 'Negociação concluída',
      description: 'A negociação deste Lead foi concluída com sucesso',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidV4(),
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
