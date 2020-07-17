const path = require('path')

module.exports = {
  migrationsConfig: (Sequelize, sequelize) => {
    const config = {
      migrations: {
        path: path.join(__dirname, '../database/migrations'),
        params: [
          sequelize.getQueryInterface(),
          Sequelize
        ]
      },
      storage: 'sequelize',
      storageOptions: {
        sequelize: sequelize
      }
    }
    return config
  },
  seedConfig: (Sequelize, sequelize) => {
    const config = {
      migrations: {
        path: path.join(__dirname, '../database/seeders'),
        params: [
          sequelize.getQueryInterface(),
          Sequelize
        ]
      },
      storage: 'sequelize',
      storageOptions: {
        sequelize: sequelize,
        modelName: 'SequelizeData'
      }
    }
    return config
  },
}