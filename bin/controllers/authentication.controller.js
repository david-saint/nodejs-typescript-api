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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const controller_base_1 = __importDefault(require("./controller.base"));
const exceptions_1 = require("exceptions");
const admin_resource_1 = __importDefault(require("resources/admin/admin.resource"));
const authentication_1 = require("./validators/authentication");
const TOKEN_EXPIRES_IN = 60 * 60;
class AuthenticationController extends controller_base_1.default {
    async login(request, response) {
        this.validate(request, authentication_1.login());
        const { email, password } = request.body;
        const user = await models_1.default.Admin.findOne({ where: { email } });
        if (user === null)
            throw new exceptions_1.AuthenticationError('User with [email] and [password] doesn\'t exist');
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
            throw new exceptions_1.AuthenticationError('User with [email] and [password] doesn\'t exist');
        const { token, expiresIn } = this.createToken({
            email,
            id: user.id,
            lastName: user.lastName,
            firstName: user.firstName,
        });
        response.setHeader('Authorization', 'Bearer ' + token);
        return response
            .status(200)
            .json({ data: { token, expiresIn, message: 'Successfully Logged in' } });
    }
    async register(request, response) {
        this.validate(request, authentication_1.register());
        const { email, password, firstName, lastName } = request.body;
        const existingUser = await models_1.default.Admin.findOne({ where: { email } });
        if (existingUser !== null)
            throw new exceptions_1.AuthenticationError('User with [email] already exists');
        const hashed = await bcrypt.hash(password, 10);
        const user = await models_1.default.Admin.create({ email, lastName, firstName, password: hashed });
        const { token } = this.createToken({ id: user.id, email, firstName, lastName });
        response.setHeader('Authorization', 'Bearer ' + token);
        return new admin_resource_1.default(user, 201);
    }
    user(request, response) {
        const user = request.user;
        return new admin_resource_1.default(user, 200);
    }
    createToken(user) {
        const secret = process.env.JWT_SECRET_ADMIN || 'nekoTetaerc';
        return {
            expiresIn: TOKEN_EXPIRES_IN,
            token: jsonwebtoken_1.default.sign(user, secret, { expiresIn: TOKEN_EXPIRES_IN }),
        };
    }
}
exports.default = AuthenticationController;
