/**
 * EXCEPTION TO BE THROWN IF AN ITEM CANONOT
 * BE FOUND.
 */
export class NotFoundError extends Error {
  public status: number;

  constructor(...props: any[]) {
    super(...props);
    this.status = 404;
    this.name = 'NotFoundError';
  }
}

/**
 * EXCEPTION FOR MALFORMED REQUEST
 */
export class BadRequestError extends Error {
  public status: number;

  constructor(...props: any[]) {
    super(...props);
    this.status = 400;
    this.name = 'BadRequestError';
  }
}

export class AuthenticationError extends Error {
  public status: number;

  constructor(...props: any[]) {
    super(...props);
    this.status = 403;
    this.name = 'AuthenticationError';
  }
}
