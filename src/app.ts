import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import createExpressHandler from './utils/expressHandller';
import ApiError from './utils/apiError';
import userRouter from './routes/auth.routes';

const app = express();

// Middleware
function startApp(app: any) {
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(bodyParser.json());

  // Parse the request body data into json format
  app.use(express.json());

  // Then check for JSON syntax error
  app.use(
    createExpressHandler((err, req, res, next) => {
      if (err) {
        const { name, message } = err;

        res
          .status(400)
          .json(
            new ApiError(400, { name, message }, false, 'Invalid JSON syntax')
          );
        return;
      }
    })
  );

  // api of todo
  app.use('/api/auth', userRouter());
}

export { startApp };
export default app;
