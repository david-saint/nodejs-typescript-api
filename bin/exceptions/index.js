"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotFoundError extends Error {
    constructor(...props) {
        super(...props);
        this.status = 404;
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends Error {
    constructor(...props) {
        super(...props);
        this.status = 400;
        this.name = 'BadRequestError';
    }
}
exports.BadRequestError = BadRequestError;
class AuthenticationError extends Error {
    constructor(...props) {
        super(...props);
        this.status = 403;
        this.name = 'AuthenticationError';
    }
}
exports.AuthenticationError = AuthenticationError;
