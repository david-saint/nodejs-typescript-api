"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_base_1 = __importDefault(require("./model.base"));
const sequelize_1 = require("sequelize");
class Admin extends model_base_1.default {
    static initialize(sequelize) {
        return super.init({
            firstName: {
                allowNull: false,
                type: sequelize_1.DataTypes.STRING,
            },
            lastName: {
                allowNull: false,
                type: sequelize_1.DataTypes.STRING,
            },
            email: {
                allowNull: false,
                type: sequelize_1.DataTypes.STRING,
                unique: {
                    name: 'email',
                    msg: 'your-message-here'
                },
            },
            password: {
                allowNull: false,
                type: sequelize_1.DataTypes.STRING,
            },
            roleId: {
                type: sequelize_1.DataTypes.NUMBER,
            },
        }, {
            sequelize,
            paranoid: true,
            timestamps: true,
            modelName: 'admin',
            underscored: true,
            tableName: 'admins',
        });
    }
    static associate(models) {
    }
}
exports.default = Admin;
