require('dotenv').config();

module.exports = {
  development: {
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_DATABASE,
    dialect: process.env.DEV_DB_CONNECTION,
    dialectOptions: {
      timezone: process.env.DEV_DB_TIMEZONE,
    },
    operatorsAliases: '0',
  },
  test: {
    host: process.env.TEST_DB_HOST,
    port: process.env.TEST_DB_PORT,
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_DATABASE,
    dialect: process.env.TEST_DB_CONNECTION,
    operatorsAliases: '0',
  },
  production: {
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT,
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_DATABASE,
    dialect: process.env.PROD_DB_CONNECTION,
    operatorsAliases: '0',
  },
};
