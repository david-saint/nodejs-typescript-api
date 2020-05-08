"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const paginator_base_1 = __importDefault(require("./paginator.base"));
const exceptions_1 = require("exceptions");
class AbstractModel extends sequelize_1.Model {
    static async find(primaryKey, options = {}) {
        const model = await this.findByPk(primaryKey, options);
        if (model === null) {
            throw new exceptions_1.NotFoundError(`Could not find a ${this.name} with id [${primaryKey}]`);
        }
        return model;
    }
    static async paginate(request, options = {}) {
        const page = paginator_base_1.default.resolveCurrentPage(request);
        const perPage = parseInt(request.query.per_page, 10) || this.getPerPage();
        if (isNaN(perPage) || perPage < 1)
            return this.findAll(options);
        const { count, rows } = await this.findAndCountAll(Object.assign(Object.assign({}, options), { limit: perPage, offset: perPage * (page - 1) }));
        const { path, query } = request;
        return new paginator_base_1.default(rows, count, perPage, page, { path, query });
    }
    static getPerPage() {
        return parseInt(process.env.PAGINATION_PER_PAGE, 10) || 25;
    }
}
exports.default = AbstractModel;
