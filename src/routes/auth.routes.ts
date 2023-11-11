import { Router } from 'express';
import { verifyAccessToken } from '../middleware/auth.middleware';
import {
  changeCurrentPassword,
  forgotPasswordRequest,
  handleSocialLogin,
  loginUser,
  logoutUser,
  resetForgottenPassword,
  registerUser,
  updateUserAvatar,
} from '../controllers/auth.controller';

function userRouter() {
  const router = Router();

  // Unsecured route
  router.route('/register').post(registerUser);

  router.route('/login').post(loginUser);

  router.route('/forgot-password').post(forgotPasswordRequest);

  router.route('/reset-password/:resetToken').post(resetForgottenPassword);

  // Secured routes
  router.route('/logout').post(verifyAccessToken, logoutUser);

  router.route('/avatar').patch(updateUserAvatar);

  router.route('/change-password').post(changeCurrentPassword);

  // SSO routes
  router.route('/google').get();

  router.route('/github').get();

  router.route('/google/callback').get(handleSocialLogin);

  router.route('/github/callback').get(handleSocialLogin);

  return router;
}

export default userRouter;
