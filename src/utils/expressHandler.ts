import express from 'express';

type ExpressFunction = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => void;

function createExpressHandler(fn: ExpressFunction) {
  return fn;
}

export default createExpressHandler;
