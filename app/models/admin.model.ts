import Model from './model.base';
import {Sequelize, DataTypes} from 'sequelize';

export default class Admin extends Model {
  /**
   * Initiialize the model with typed fields, and add configurations.
   *
   * @param  {Object} sequelize
   * @param  {Object} DataTypes
   * @return {Object}
   */
  static initialize(sequelize: Sequelize) {
    return super.init(
      {
        firstName: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        lastName: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        email: {
          allowNull: false,
          type: DataTypes.STRING,
          unique: {
            name: 'email',
            msg: 'your-message-here'
          },
        },
        password: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        roleId: {
          type: DataTypes.NUMBER,
        },
      },
      {
        sequelize,
        paranoid: true,
        timestamps: true,
        modelName: 'admin',
        underscored: true,
        tableName: 'admins',
      },
    );
  }

  /**
   * Define model relationships.
   *
   * @param  {Object} models
   * @return {void}
   */
  static associate(models: Record<string, any>) {
    // specify the relations as property
  }
}