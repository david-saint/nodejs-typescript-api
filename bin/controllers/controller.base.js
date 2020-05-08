"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("models"));
class Controller {
    validate(request, validator) {
        if (validator === null)
            return null;
        if (Array.isArray(validator))
            return validator.map((v) => this.validate(request, v));
        const { value, error } = validator.validate(request);
        if (error) {
            error.status = 400;
            throw error;
        }
        return value;
    }
    async validateAsync(request, validator = null) {
        return this.validate(request, validator);
    }
    includes({ query }) {
        const withRelations = query.with ? query.with.split(',') : undefined;
        return withRelations && withRelations
            .filter((r) => typeof models_1.default[r] !== 'undefined')
            .map((r) => models_1.default[r]);
    }
}
exports.default = Controller;
