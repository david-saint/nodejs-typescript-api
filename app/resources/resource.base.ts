import _ from 'lodash';
import {Request, Response} from 'express';
import IResource from './resource.interface';
import Paginator from 'models/paginator.base';
import MissingValue from './missing-value.base';
import IResourceCollection from './resource-collection.interface';

export default class Resource implements IResource {
  /**
   * The object name that wraps the
   * response
   * @type {string}
   */
  public wrapper: string;

  /**
   * The status to send if successful.
   * @type {number}
   */
  private _status: number;

  /**
   * The model that you want to resource
   * @type {Model}
   */
  protected _resource: Record<string, any>;

  /**
   * The request instance.
   * @type {Request}
   */
  // @ts-ignore
  protected _request: Request;

  /**
   * The default path for resources.
   * 
   * @type {string}
   */
  public static path: string = '';

  /**
   * Create a new resource instance.
   *
   * @param  {mixed} resource
   * @return {void}
   */
  constructor(resource: Record<string, any>, status = 200) {
    // this is what all the resources would be wrapped in
    this.wrapper = 'data';
    // the resource instance
    this._resource = resource;
    // the status of the response
    this._status = status;
  }

  /**
   * get the resource instance.
   *
   * @return {mixed}
   */
  get resource() { return this._resource; }

  /**
   * Set the request instance.
   *
   * @param  {Request} request
   * @return {void}
   */
  set request(request: Request) { this._request = request; }

  /**
   * Retrieve a value based on a given condition
   *
   * @param  {Boolean} condition
   * @param  {mixed} value
   * @param  {miixed} $default
   * @return {MissingValue|mixed}
   */
  when(condition: boolean, value: any, $default = null) {
    // if the condition is met return the value
    if (condition && typeof value !== 'function') return value;
    // if the condition is met return the value of the value
    if (condition && typeof value === 'function') return value();
    // otherwise, return default or missing value accordingly
    return arguments.length === 3 ? $default : new MissingValue();
  }

  /**
   * Retrieve a relationship if it has been loaded.
   *
   * @param  {String} relationship
   * @param  {mixed} value
   * @param  {mixed} reflex         The default value.
   * @return {MissingValue|Mixed}
   */
  whenLoaded(relationship: string, value = null, $default = null) {
    let reflex: any = $default;

    // if there's no default value, let reflex be missing value
    if (arguments.length < 3) { reflex = new MissingValue(); }
    // if the relation is not loaded return default
    if (typeof this.resource[relationship] === 'undefined') return reflex;
    // if the relation is loaded and there's value to return return the loaded relation.
    if (arguments.length === 1) return this.resource[relationship];
    // if we think the relation is loaded, but it's actually null return null.
    if (this.resource[relationship] === null) return null;

    // @ts-ignore
    return typeof value === 'function' ? value() : value;
  }

  /**
   * Default make method.. incase they don't specify a make
   * method in the parent class.
   *
   * @param  {Request} request
   * @return {mixed}
   */
  make(request: Request) { return this._resource; }

  /**
   * Default response status, overiide this method
   * to be able to change the status of response.
   * @return {[type]} [description]
   */
  responseStatus() { return this._status; }

  /**
   * Resolve the resource to useable object format.
   *
   * @param  {Request} request
   * @return {Object}
   */
  resolve(request = this._request) {
    // if the resource is empty return null
    if (this._resource === null) return null;
    // make the data
    let data = this.make(request);
    // if the data from the make is a function call it.
    if (typeof data === 'function') { data = data(); }

    return Resource.removeMissingValues(data, request);
  }

  /**
   * Create the HTTP response that represents the object.
   * @param  {Request} request
   * @return {Object}
   */
  toResponse(request?: Request): Record<string, any> {
    return {
      status: this.responseStatus(),
      [this.wrapper]: this.resolve(request),
    };
  }

  /**
   * create a new resource collection.
   *
   * @param  {mixed} resource
   * @param  {Number} status
   * @return {AnonymousResourceCollection}
   */
  static collection(resource: Record<string, any>, status = 200) {
    return new ResourceCollection(resource, status, this);
  }

  /**
   * Remove the missing values from the filtered data.
   *
   * @param  {Object} data
   * @return {Obejct}
   */
  static removeMissingValues(data: Record<string, any>, request: Request) {
    /* eslint-disable no-restricted-syntax */
    for (const [key, value] of Object.entries(data)) {
      /* eslint-enable no-restricted-syntax */
      if ((value instanceof MissingValue && value.isMissing())
          || (value instanceof Resource
            && value.resource instanceof MissingValue
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


export class ResourceCollection extends Resource implements IResourceCollection {

  /**
   * the resource type that would be in the collection.
   * @type {IResource}
   */
  public Collects: IResource;

  /**
   * Create a new resource instance.
   * @param  {mixed} resource
   * @param  {int} status
   * @param  {string} collects
   * @return {void}
   */
  constructor(resource: Record<string, any>, status: number, collects: any) {
    super(resource, status);
    this.Collects = collects;
    this._resource = this.collectResource(resource);
  }

  /**
   * map the given array of resources to its individual
   * resources..,
   * @param  {array|MissingValue} resource
   * @return {array|MissingValue}
   */
  collectResource(resource: Record<string, any>) {
    if (resource instanceof MissingValue) return resource;

    // @ts-ignore
    const res = this.Collects && !(resource[0] instanceof this.Collects)
      // @ts-ignore
      ? resource.map(r => new this.Collects(r))
      : resource;

    return resource instanceof Paginator
      ? resource.setItems(res)
      : res;
  }

  /**
   * Transofrm the resource into a JSON array
   * @param  {Request} request
   * @return {array}
   */
  make(request: any): Array<Record<string, any>> {
    return this._resource.map((r: IResource) => r.resolve(request));
  }

  /**
   * Create an HTTP response that represents the object
   * @param  {Request} request
   * @return {object}
   */
  toResponse(request: any) {
    // create response depending on
    // if it's a paginator or not
    return this._resource instanceof Paginator
      ? this.toPaginatorResponse(request)
      : super.toResponse(request);
  }

  /**
   * Create an HTTP response that represents the object
   *
   * @param  {[type]} request [description]
   * @return {[type]}         [description]
   */
  toPaginatorResponse(request: any) {
    return {
      status: this.responseStatus(),
      [this.wrapper]: this.resolve(request),
      ...this.paginationInformation(),
    };
  }

  /**
   * Add the pagination information to the
   * response..
   * @return {[type]} [description]
   */
  paginationInformation() {
    // get the pagination response
    const response = this._resource.toResponse();

    return {
      links: this.paginationLinks(response),
      meta: this.meta(response),
    };
  }

  /**
   * Get the pagination links for the response
   * @param  {[type]} pagination [description]
   * @return {[type]}            [description]
   */
  paginationLinks(pagination: Record<string, any>) {
    // return it formatted how you like.
    return {
      first: pagination.firstPageUrl || null,
      last: pagination.lastPageUrl || null,
      prev: pagination.prevPageUrl || null,
      next: pagination.nextPageUrl || null,
    };
  }

  /**
   * Gather the meta data for the response.
   * @param  {[type]} pagination [description]
   * @return {[type]}            [description]
   */
  meta(pagination: Record<string, any>) {
    // list of properties to be filtered out of
    // the pagination object.
    const notAllowed = [
      'data',
      'prevPageUrl',
      'nextPageUrl',
      'lastPageUrl',
      'firstPageUrl',
    ];
    // return the filtered Object
    return Object.keys(pagination)
      .filter(k => !notAllowed.includes(k))
      .reduce((o: Record<string, any>, k) => {
        o[k] = pagination[k];
        return o;
      }, {});
  }
}
