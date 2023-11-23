import { Router } from 'express';
import passport from 'passport';
import google from 'passport-google-oauth20';
import { verifyAccessToken } from '../middleware/auth.middleware';
import {
  changeCurrentPassword,
  handleSocialLogin,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/auth.controller';
import {
  changePasswordUserValidator,
  loginUserValidator,
  registerUserValidator,
} from '../validators/user.validator';

function userRouter() {
  const router = Router();

  // Unsecured route
  router.route('/register').post(registerUserValidator, registerUser);

  router.route('/login').post(loginUserValidator, loginUser);

  router.route('/logout').post(verifyAccessToken, logoutUser);

  // Secured routes

  router
    .route('/change-password')
    .post(changePasswordUserValidator, changeCurrentPassword);

  // SSO routes
  passport.use(
    new google.Strategy(
      {
        clientID: String(process.env.GOOGLE_CLIENT_ID),
        clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
        callbackURL: 'http://localhost:3030/api/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        // Use the profile information (e.g., profile.id, profile.displayName) to create or log in the user.
        return done(null, profile);
      }
    )
  );
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj: Express.User, done) => done(null, obj));
  router.route('/google').get(
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    }),
    (req, res) => {
      res.send('redirecting to google...');
    }
  );

  router
    .route('/google/callback')
    .get(passport.authenticate('google'), handleSocialLogin);

  return router;
}

export default userRouter;
