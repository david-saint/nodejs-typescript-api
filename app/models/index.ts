import fs from 'fs';
import path from 'path';
import Model from './model.base';
import {Sequelize, DataTypes} from 'sequelize';
import configurations from '../../config/database';

type nodeEnvironment = 'development' | 'production' | 'test';

const basename = path.basename(__filename);
// @ts-ignore
const env: nodeEnvironment = process.env.NODE_ENV || 'development';
const config = configurations[env];
const db: Record<string, any> = {};

let sequelize: Sequelize;
sequelize = new Sequelize(config.database, config.username, config.password, config);

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-9, -3) === '.model'))
  .forEach(async (file) => {
    const model = (await import(path.join(__dirname, file))).default;
    db[model.name] = model.initialize(sequelize);
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
