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
const paginator_base_1 = __importDefault(require("models/paginator.base"));
const missing_value_base_1 = __importDefault(require("./missing-value.base"));
class Resource {
    constructor(resource, status = 200) {
        this.wrapper = 'data';
        this._resource = resource;
        this._status = status;
    }
    get resource() { return this._resource; }
    set request(request) { this._request = request; }
    when(condition, value, $default = null) {
        if (condition && typeof value !== 'function')
            return value;
        if (condition && typeof value === 'function')
            return value();
        return arguments.length === 3 ? $default : new missing_value_base_1.default();
    }
    whenLoaded(relationship, value = null, $default = null) {
        let reflex = $default;
        if (arguments.length < 3) {
            reflex = new missing_value_base_1.default();
        }
        if (typeof this.resource[relationship] === 'undefined')
            return reflex;
        if (arguments.length === 1)
            return this.resource[relationship];
        if (this.resource[relationship] === null)
            return null;
        return typeof value === 'function' ? value() : value;
    }
    make(request) { return this._resource; }
    responseStatus() { return this._status; }
    resolve(request = this._request) {
        if (this._resource === null)
            return null;
        let data = this.make(request);
        if (typeof data === 'function') {
            data = data();
        }
        return Resource.removeMissingValues(data, request);
    }
    toResponse(request) {
        return {
            status: this.responseStatus(),
            [this.wrapper]: this.resolve(request),
        };
    }
    static collection(resource, status = 200) {
        return new ResourceCollection(resource, status, this.name);
    }
    static removeMissingValues(data, request) {
        for (const [key, value] of Object.entries(data)) {
            if ((value instanceof missing_value_base_1.default && value.isMissing())
                || (value instanceof Resource
                    && value.resource instanceof missing_value_base_1.default
                    && value.resource.isMissing())) {
                delete data[key];
            }
            if (value instanceof Resource) {
                data[key] = value.resolve(request);
            }
        }
        return data;
    }
}
exports.default = Resource;
class ResourceCollection extends Resource {
    constructor(resource, status, collects) {
        super(resource, status);
        Promise.resolve().then(() => __importStar(require(`../${collects}`))).then(collect => {
            this.Collects = collect;
        });
        this._resource = this.collectResource(resource);
    }
    collectResource(resource) {
        if (resource instanceof missing_value_base_1.default)
            return resource;
        const res = this.Collects && !(resource[0] instanceof this.Collects)
            ? resource.map(r => new this.Collects(r))
            : resource;
        return resource instanceof paginator_base_1.default
            ? resource.setItems(res)
            : res;
    }
    make(request) {
        return this._resource.map((r) => r.resolve(request));
    }
    toResponse(request) {
        return this._resource instanceof paginator_base_1.default
            ? this.toPaginatorResponse(request)
            : super.toResponse(request);
    }
    toPaginatorResponse(request) {
        return Object.assign({ status: this.responseStatus(), [this.wrapper]: this.resolve(request) }, this.paginationInformation());
    }
    paginationInformation() {
        const response = this._resource.toResponse();
        return {
            links: this.paginationLinks(response),
            meta: this.meta(response),
        };
    }
    paginationLinks(pagination) {
        return {
            first: pagination.firstPageUrl || null,
            last: pagination.lastPageUrl || null,
            prev: pagination.prevPageUrl || null,
            next: pagination.nextPageUrl || null,
        };
    }
    meta(pagination) {
        const notAllowed = [
            'data',
            'prevPageUrl',
            'nextPageUrl',
            'lastPageUrl',
            'firstPageUrl',
        ];
        return Object.keys(pagination)
            .filter(k => !notAllowed.includes(k))
            .reduce((o, k) => {
            o[k] = pagination[k];
            return o;
        }, {});
    }
}
exports.ResourceCollection = ResourceCollection;
