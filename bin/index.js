"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const handlers_1 = require("./routes/__init__/handlers");
const app = express_1.default();
app.use(morgan_1.default('dev'));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});
app.use('/', routes_1.default);
app.use(handlers_1.notFound);
if (app.get('env') === 'development') {
    app.use(handlers_1.developmentErrors);
}
app.use(handlers_1.productionErrors);
exports.default = app;
