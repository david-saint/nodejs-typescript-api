"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resource_base_1 = __importDefault(require("../resource.base"));
class AdminResource extends resource_base_1.default {
    make(request) {
        return {
            id: this.resource.id,
            email: this.resource.email,
            last_name: this.resource.lastName,
            first_name: this.resource.firstName,
        };
    }
}
exports.default = AdminResource;
