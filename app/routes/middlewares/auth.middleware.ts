import models from 'models';
import * as jwt from 'jsonwebtoken';
import Model from 'models/model.base';
import {AuthenticationError} from 'exceptions';
import { NextFunction, Response } from 'express';
import {RequestWithUser} from 'controllers/controller.interface';
import {DataEncodedInToken} from 'controllers/authentication.controller';

function authMiddlewareFactory(guard = 'admin') {
  let secret: string;
  let userModel: () => Promise<typeof Model>;

  switch (guard) {
    case 'admin':
      userModel = async () => models.Admin;
      secret = process.env.JWT_SECRET_ADMIN || 'nekoTetaerc';
      break;

    case 'user':
      secret = process.env.JWT_SECRET_USER || 'nekoTetaerc';
      break;
  }

  return async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
    if (!request.headers.authorization || !request.headers.authorization.startsWith('Bearer '))
      throw new AuthenticationError('Invalid Token');

    let userToken: string = request.headers.authorization.split('Bearer ')[1];

    try {
      const {id} = jwt.verify(userToken, secret) as DataEncodedInToken;
      const user = await (await userModel()).find(id);
      request.user = user;
      next();
    } catch (error) {
      console.error(error);
      throw new AuthenticationError('Unauthorized: Invalid Token');
    }
  }
}
 
export default authMiddlewareFactory;