import {Request, Response} from 'express';

export interface IError extends Error{
  status?: number;
}

/*
  Catch Errors Handler
  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/
export const catchErrors = (fn: any) => (req: Request, res: Response, next: any) => fn(req, res, next).catch(next);

/*
  Not Found Error Handler
  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
export const notFound = (req: Request, res: Response, next: any) => {
  const err: IError = new Error('Not Found');
  err.status = 404;
  next(err);
};

/*
  Development Error Hanlder
  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
export const developmentErrors = (err: IError, req: Request, res: Response, next: any) => {
  err.stack = err.stack || '';
  const errorDetails = {
    type: err.name,
    message: err.message,
    status: err.status || 500,
    stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>'),
  };
  res.status(err.status || 500);
  res.format({
    'application/json': () => res.json(errorDetails), // Ajax call, send JSON back
  });
};


/*
  Production Error Handler
  No stacktraces are leaked to user
*/
export const productionErrors = (err: IError, req: Request, res:Response, next:any) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err.stack,
  });
};
