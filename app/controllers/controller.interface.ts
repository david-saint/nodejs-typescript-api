import {Request, Response} from 'express';

export interface IController {
  validate: (request: Request, validator: any) => any;
  includes: (request: Request) => Array<any> | undefined;
  validateAsync: (request: Request, validator: any) => Promise<any>;
}

export interface ControllerCtor {
  new (): IController;
}

export interface RequestWithUser extends Request {
  user?: Record<string, any>;
}

export default IController;
