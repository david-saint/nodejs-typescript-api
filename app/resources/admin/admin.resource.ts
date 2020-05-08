import {Request} from 'express';
import Resource from '../resource.base';

class AdminResource extends Resource {
  /**
   * Define the format of the ussdstructure response
   * @param  {[type]} request [description]
   * @return {[type]}         [description]
   */
  make(request: Request) {
    return {
      id: this.resource.id,
      email: this.resource.email,
      last_name: this.resource.lastName,
      first_name: this.resource.firstName,
    };
  }
}

export default AdminResource;
