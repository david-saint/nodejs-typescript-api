import models from 'models';
import {Request, Response} from 'express';
import IControler from './controller.interface';

export default class Controller implements IControler {

  /**
   * Handles data validation.
   * @param  {Object} options.body
   * @param  {mixed} validator
   * @return {Array|Object}
   */
  public validate(request: Request, validator: any): any {
    if (validator === null) return null;
    // If an array of validators was passed, recursively run each of them.
    if (Array.isArray(validator)) return validator.map((v: any) => this.validate(request, v));
    // run the validate logic on the request.
    const { value, error } = validator.validate(request);
    // if there's an error throw it to exit out of the process...
    if (error) { error.status = 400; throw error; }
    // return the value
    return value;
  }

  /**
   * Handles validation asynchronously.
   *
   * @param  {Request} request
   * @param  {mixed} validator
   * @return {Array|Object}
   */
  public async validateAsync(request: Request, validator = null): Promise<any> {
    // return the validation asynchronously.. I guess.
    return this.validate(request, validator);
  }

  /**
   * returns an array of models, that the api
   * consumer wants loaded with the response.
   *
   * @param  {Request} request.query
   * @return {array}s
   */
  includes({ query }: Request): Array<any> | undefined {
    // @ts-ignore get the with query from the request
    const withRelations = query.with ? query.with.split(',') : undefined;
    // filter the valid ones
    return withRelations && withRelations
      .filter((r: string) => typeof models[r] !== 'undefined')
      .map((r: string) => models[r]);
  }
}
