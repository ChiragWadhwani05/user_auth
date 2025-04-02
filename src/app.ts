import express from 'express';
import cors from 'cors';
import createExpressErrorHandler from './utils/expressErrorHandler';
import ApiError from './utils/apiError';
import ApiResponse from './utils/apiResponse';
import userRouter from './routes/auth.routes';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
const app = express();

// Middleware
function startApp(app: any) {
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  // Parse the request body data into json format
  app.use(express.json());
  app.use(cookieParser());

  // Then check for JSON syntax error
  app.use(
    createExpressErrorHandler((err, req, res, next) => {
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
  app.use(
    session({
      secret: String(process.env.SESSION_SECRET),
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  // api of todo
  app.use('/api/auth', userRouter());
  app.get('/api/health', (req : any, res : any) => {
    return res
      .status(200)
      .json(200, 'Server is healthy and running.');
  });
}

export { startApp };
export default app;
