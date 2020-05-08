import {Request} from 'express';

export interface IResource {
  wrapper: string;
  request: Request;
  responseStatus: () => number;
  resolve: (request: Request | undefined) => any;
  make: (request: Request) => Record<string, any>;
  toResponse: (request?: Request) => Record<string, any>;
  when: (condition: boolean, value: any, $default: any) => any;
  whenLoaded: (relationship: string, value: any, $default: any) => any;
}

export interface ResourceCtr {
  new(resource: Record<string, any>, status?: number): IResource;
}

export default IResource;
