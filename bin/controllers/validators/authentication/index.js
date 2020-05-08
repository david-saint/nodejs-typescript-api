"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const JOI = __importStar(require("@hapi/joi"));
function login() {
    const schema = JOI.object({
        body: JOI.object({
            email: JOI.string().email().required(),
            password: JOI.string().max(255).required(),
        }),
    }).unknown();
    return schema;
}
exports.login = login;
function register() {
    const schema = JOI.object({
        body: JOI.object({
            email: JOI.string().email().required(),
            password: JOI.string().max(255).required(),
            firstName: JOI.string().max(255).required(),
            lastName: JOI.string().max(255).required(),
        }),
    }).unknown();
    return schema;
}
exports.register = register;
