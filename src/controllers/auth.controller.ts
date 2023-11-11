import createExpressHandler from '../utils/expressHandller';
import ApiError from '../utils/apiError';
import ApiResponse from '../utils/apiResponse';

const changeCurrentPassword = createExpressHandler(async (req, res) => {});

const forgotPasswordRequest = createExpressHandler(async (req, res) => {});

const handleSocialLogin = createExpressHandler(async (req, res) => {});

const loginUser = createExpressHandler(async (req, res) => {});

const logoutUser = createExpressHandler(async (req, res) => {});

const resetForgottenPassword = createExpressHandler(async (req, res) => {});

const registerUser = createExpressHandler(async (req, res) => {});

const updateUserAvatar = createExpressHandler(async (req, res) => {});

export {
  changeCurrentPassword,
  forgotPasswordRequest,
  handleSocialLogin,
  loginUser,
  logoutUser,
  resetForgottenPassword,
  registerUser,
  updateUserAvatar,
};
