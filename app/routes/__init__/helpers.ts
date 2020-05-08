import {Request, Response} from 'express';
import Resource from 'resources/resource.base';
import {ControllerCtor} from 'controllers/controller.interface';

// determine if an object has a property
export const has = Object.prototype.hasOwnProperty;

// Method for binding a controller method to the route
export function resolve(Controller: ControllerCtor, method: string) {
  // create a new instance of the controller.e
  const instance: any = new Controller();

  // if there's no method throw this error.
  if (!instance[method]) {
    return (req: Request, res: Response, next: any) => Promise.resolve().then(() => {
      throw new ReferenceError(
        `Call to undefined [Method] - '${method}' on [Controller] - '${Controller.name}'`,
      );
    }).catch(next);
  }

  return (req: Request, res: Response, next: any) => Promise.resolve()
    .then(async () => {
      // get the response from the controller method.
      let response = await instance[method](req, res, next);
      // if a Resource wasn't sent.. return what was sent
      if (!(response instanceof Resource)) return response;
      // if it was a resource.. convert it to a response.
      response = response.toResponse();
      // return the converted ish..
      return res.status(response.status).json(response);
    })
    .catch(next);
}
