"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("models"));
const jwt = __importStar(require("jsonwebtoken"));
const exceptions_1 = require("exceptions");
function authMiddlewareFactory(guard = 'admin') {
    let secret;
    let userModel;
    switch (guard) {
        case 'admin':
            userModel = async () => models_1.default.Admin;
            secret = process.env.JWT_SECRET_ADMIN || 'nekoTetaerc';
            break;
        case 'user':
            secret = process.env.JWT_SECRET_USER || 'nekoTetaerc';
            break;
    }
    return async function authMiddleware(request, response, next) {
        if (!request.headers.authorization || !request.headers.authorization.startsWith('Bearer '))
            throw new exceptions_1.AuthenticationError('Invalid Token');
        let userToken = request.headers.authorization.split('Bearer ')[1];
        try {
            const { id } = jwt.verify(userToken, secret);
            const user = await (await userModel()).find(id);
            request.user = user;
            next();
        }
        catch (error) {
            console.error(error);
            throw new exceptions_1.AuthenticationError('Unauthorized: Invalid Token');
        }
    };
}
exports.default = authMiddlewareFactory;
