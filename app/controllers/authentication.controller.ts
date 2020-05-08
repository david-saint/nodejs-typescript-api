import models from 'models';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import {Request, Response} from 'express';
import Controller from './controller.base';
import {AuthenticationError} from 'exceptions';
import {RequestWithUser} from './controller.interface';
import AdminResource from 'resources/admin/admin.resource';
import {
  login as loginValidator,
  register as registrationValidator,
} from './validators/authentication';


interface TokenData {
  token: string;
  expiresIn: number;
}

export interface DataEncodedInToken {
  id: number;
  email: string;
  lastName: string;
  firstName: string;
}

const TOKEN_EXPIRES_IN: number = 60 * 60;


export default class AuthenticationController extends Controller {
  /**
   * Method that handles the login of users.
   * 
   * @param {Request}  request  [description]
   * @param {Response} response [description]
   */
  public async login(request: Request, response: Response) {
    // validate the request
    this.validate(request, loginValidator());

    // destructure the needed data
    const {email, password} = request.body;

    // get the existing user
    const user = await models.Admin.findOne({where: {email}});

    // throw user doesn't exist exception
    if (user === null) throw new AuthenticationError('User with [email] and [password] doesn\'t exist');

    // compare the passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) throw new AuthenticationError('User with [email] and [password] doesn\'t exist');

    // generate a token for the user
    const {token, expiresIn}: TokenData = this.createToken({
      email,
      id: user.id,
      lastName: user.lastName,
      firstName: user.firstName,
    });

    // set the header.
    response.setHeader('Authorization', 'Bearer ' + token);

    return response
            .status(200)
            .json({data: {token, expiresIn, message: 'Successfully Logged in'}});
  }

  /**
   * Method that handles the registration of users.
   * 
   * @param {Request}  request  [description]
   * @param {Response} response [description]
   */
  public async register(request: Request, response: Response) {
    // validate the request
    this.validate(request, registrationValidator());

    // destructure the needed data
    const {email, password, firstName, lastName} = request.body;

    // get the existing user
    const existingUser = await models.Admin.findOne({where: {email}});

    // if there's already a user throw an error.
    if (existingUser !== null) throw new AuthenticationError('User with [email] already exists');

    // hash the password
    const hashed = await bcrypt.hash(password, 10);

    // create the user
    const user = await models.Admin.create({email, lastName, firstName, password: hashed });

    // generate a token for the user
    const {token}: TokenData = this.createToken({id: user.id, email, firstName, lastName});

    // set the header.
    response.setHeader('Authorization', 'Bearer ' + token);

    // return the created user
    return new AdminResource(user, 201);
  }


  public user(request: RequestWithUser, response: Response) {
    const user = request.user;

    // @ts-ignore
    return new AdminResource(user, 200);
  }

  /**
   * Create a JWT signed tokenm.
   * @param  {any}       user [description]
   * @return {TokenData}      [description]
   */
  private createToken(user: DataEncodedInToken): TokenData {
    // get the secret
    const secret: string = process.env.JWT_SECRET_ADMIN || 'nekoTetaerc';

    return {
      expiresIn: TOKEN_EXPIRES_IN,
      token: jwt.sign(user, secret, { expiresIn: TOKEN_EXPIRES_IN }),
    };
  }
}
