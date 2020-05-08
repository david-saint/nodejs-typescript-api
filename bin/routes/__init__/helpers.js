"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resource_base_1 = __importDefault(require("resources/resource.base"));
exports.has = Object.prototype.hasOwnProperty;
function resolve(Controller, method) {
    const instance = new Controller();
    if (!instance[method]) {
        return (req, res, next) => Promise.resolve().then(() => {
            throw new ReferenceError(`Call to undefined [Method] - '${method}' on [Controller] - '${Controller.name}'`);
        }).catch(next);
    }
    return (req, res, next) => Promise.resolve()
        .then(async () => {
        let response = await instance[method](req, res, next);
        if (!(response instanceof resource_base_1.default))
            return response;
        response = response.toResponse();
        return res.status(response.status).json(response);
    })
        .catch(next);
}
exports.resolve = resolve;
