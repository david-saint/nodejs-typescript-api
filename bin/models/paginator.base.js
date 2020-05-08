"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const querystring_1 = __importDefault(require("querystring"));
class Paginator extends Array {
    constructor(items, total, perPage, currentPage = 1, options = {}) {
        super();
        this.items = items;
        this.total = total;
        this.perPage = perPage;
        this.options = options;
        this.currentPage = this.setCurrentPage(currentPage || 1);
        this.lastPage = Math.max(Math.ceil(total / perPage), 1);
        for (let i = this.items.length - 1; i >= 0; i -= 1) {
            this.push(this.items[i]);
        }
    }
    setCurrentPage(currentPage) {
        const page = currentPage || 1;
        return Paginator.isValidPageNumber(page)
            ? parseInt(page, 10)
            : 1;
    }
    setItems(items) {
        return new Paginator(items, this.total, this.perPage, this.currentPage, this.options);
    }
    toResponse() {
        return {
            data: this.items,
            total: this.total,
            to: this.lastItem(),
            from: this.firstItem(),
            perPage: this.perPage,
            path: this.options.path,
            lastPage: this.lastPage,
            currentPage: this.currentPage,
            firstPageUrl: this.url(1),
            lastPageUrl: this.url(this.lastPage),
            prevPageUrl: this.previousPageUrl(),
            nextPageUrl: this.nextPageUrl(),
        };
    }
    firstItem() {
        return this.items.length > 0
            ? (this.currentPage - 1) * this.perPage + 1
            : 0;
    }
    lastItem() {
        return this.items.length > 0
            ? this.firstItem() + this.items.length - 1
            : 0;
    }
    url(p) {
        let page = p;
        if (page <= 0) {
            page = 1;
        }
        const params = Object.assign(Object.assign({}, this.options.query), { page });
        const path = this.options.path || '';
        return `${path}${path.includes('?') ? '&' : '?'}${querystring_1.default.stringify(params)}`;
    }
    nextPageUrl() {
        return (this.lastPage > this.currentPage)
            ? this.url(this.currentPage + 1)
            : null;
    }
    previousPageUrl() {
        return (this.currentPage > 1)
            ? this.url(this.currentPage - 1)
            : null;
    }
    static isValidPageNumber(page) {
        return !isNaN(page) && page >= 1;
    }
    static resolveCurrentPage(request) {
        return this.isValidPageNumber(request.query.page)
            ? parseInt(request.query.page, 10)
            : 1;
    }
}
exports.default = Paginator;
