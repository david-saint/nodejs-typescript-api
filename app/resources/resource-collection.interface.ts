import {Request} from 'express';
import IResource from './resource.interface';

export interface IResourceCollection extends IResource {
  Collects: IResource;
  resolve: (request: Request | undefined) => any;
  make: (request: Request) => Array<Record<string, any>>;
}

export interface ResourceCollectionCtr {
  new(resource: Record<string, any>, status: number, collects: string): IResourceCollection;
}

export default IResourceCollection;
