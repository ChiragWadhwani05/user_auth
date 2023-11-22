import createExpressHandler from '../utils/expressHandler';
import ApiError from '../utils/apiError';
import ApiResponse from '../utils/apiResponse';
import {
  getUserByEmail,
  getUserByUsername,
  register,
} from '../models/auth.model';

const changeCurrentPassword = createExpressHandler(async (req, res) => {});

const forgotPasswordRequest = createExpressHandler(async (req, res) => {});

const handleSocialLogin = createExpressHandler(async (req, res) => {});

const loginUser = createExpressHandler(async (req, res) => {});

const logoutUser = createExpressHandler(async (req, res) => {});

const resetForgottenPassword = createExpressHandler(async (req, res) => {});

const registerUser = createExpressHandler(async (req, res) => {
  try {
    const { givenName, lastName, email, userName, password, role } =
      req.body as {
        givenName: string;
        lastName: string;
        email: string;
        userName: string;
        password: string;
        role: string;
      };
    // let userExists = await getUserByUsername(userName);
    // if (userExists !== null) {
    //   res
    //     .status(409)
    //     .json(
    //       new ApiResponse(
    //         409,
    //         null,
    //         `User with username ${userName} already exists.`,
    //         false
    //       )
    //     );
    //   return;
    // }
    // userExists = await getUserByEmail(email);
    // if (userExists) {
    //   res
    //     .status(409)
    //     .json(
    //       new ApiResponse(
    //         409,
    //         null,
    //         `User with email ${email} already exists.`,
    //         false
    //       )
    //     );
    //   return;
    // }

    const user = await register(
      givenName,
      lastName,
      email,
      userName,
      password,
      '/dummy_profile_image.jpeg',
      role
    );
    const userDto = {
      id: user.id,
      givenName: user.givenName,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
      avatar: user.avatar,
      role: user.role,
    };
    res
      .status(201)
      .json(new ApiResponse(201, user, 'User registered seccessfully', true));
  } catch (error: any) {
    const { message } = error;
    res.status(500).json(new ApiError(500, error, false, message));
  }
});

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
