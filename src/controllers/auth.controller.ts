import createExpressHandler from '../utils/expressHandler';
import ApiError from '../utils/apiError';
import ApiResponse from '../utils/apiResponse';
import {
  generateAccessToken,
  getUserByEmail,
  getUserByUsername,
  isPasswordCorrect,
  register,
} from '../models/auth.model';

const changeCurrentPassword = createExpressHandler(async (req, res) => {});

const handleSocialLogin = createExpressHandler(async (req, res) => {
  try {
    const { name, displayName, emails, photos, provider } = req.user as {
      name: {
        lastName: string;
        givenName: string;
      };
      displayName: string;
      emails: [{ value: string; verified: boolean }];
      photos: [{ value: string }];
      provider: string;
    };
    const userName = displayName.toLowerCase().replace(' ', '');
    const user = await getUserByUsername(userName);
    if (user) {
      const userDto = {
        id: user.id,
        givenName: user.givenName,
        familyName: user.familyName,
        email: user.email,
        userName: user.userName,
        avatar: user.avatar,
        role: user.role,
      };

      const accessToken = await generateAccessToken(user.id, user.userName);

      res
        .status(200)
        .cookie('accessToken', accessToken)
        .json(
          new ApiResponse(200, userDto, 'User logged in successfully', true)
        );
      return;
    }
    const registerUser = await register(
      name.givenName,
      name.lastName,
      emails[0].value,
      userName,
      '',
      photos[0].value,
      'user'
    );

    const userDto = {
      id: registerUser.id,
      givenName: registerUser.givenName,
      familyName: registerUser.lastName,
      email: registerUser.email,
      userName: registerUser.userName,
      avatar: registerUser.avatar,
      role: registerUser.role,
    };

    const accessToken = await generateAccessToken(
      registerUser.id,
      registerUser.userName
    );

    res
      .status(200)
      .cookie('accessToken', accessToken)
      .json(new ApiResponse(200, userDto, 'User logged in successfully', true));
  } catch (error) {}
});

const loginUser = createExpressHandler(async (req, res) => {
  try {
    const { userName, password } = req.body as {
      userName: string;
      password: string;
    };
    const user = await getUserByUsername(userName);
    if (!user) {
      res
        .status(404)
        .json(
          new ApiResponse(
            404,
            null,
            `User with username ${userName} does not exist.`,
            false
          )
        );
      return;
    }
    const checkPassword = await isPasswordCorrect(userName, password);
    if (!checkPassword) {
      res
        .status(401)
        .json(new ApiResponse(401, null, 'Invalid credentials', false));
      return;
    }

    const userDto = {
      id: user.id,
      givenName: user.givenName,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
      avatar: user.avatar,
      role: user.role,
    };
    const accessToken = await generateAccessToken(user.id, userName);
    res
      .status(200)
      .cookie('accessToken', accessToken, { httpOnly: true })
      .json(new ApiResponse(200, userDto, 'User logged in successfully', true));
  } catch (error: any) {
    const { message } = error;
    throw new ApiError(500, error, false, message);
  }
});

const logoutUser = createExpressHandler(async (req, res) => {
  try {
    const { decodedUserName } = req.body;
    const user = await getUserByUsername(decodedUserName);
    if (!user) {
      res
        .status(404)
        .json(
          new ApiResponse(
            404,
            null,
            `User with username ${decodedUserName} does not exist.`,
            false
          )
        );
      return;
    }
    const userDto = {
      id: user.id,
      givenName: user.givenName,
      familyName: user.lastName,
      email: user.email,
      userName: user.userName,
      avatar: user.avatar,
      role: user.role,
    };

    res
      .status(200)
      .clearCookie('accessToken')
      .json(
        new ApiResponse(200, userDto, 'User logged out successfully', true)
      );
  } catch (error: any) {
    const { message } = error;
    throw new ApiError(500, error, false, message);
  }
});

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
    let userExists = await getUserByUsername(userName);
    if (userExists !== null) {
      res
        .status(409)
        .json(
          new ApiResponse(
            409,
            null,
            `User with username ${userName} already exists.`,
            false
          )
        );
      return;
    }
    userExists = await getUserByEmail(email);
    if (userExists) {
      res
        .status(409)
        .json(
          new ApiResponse(
            409,
            null,
            `User with email ${email} already exists.`,
            false
          )
        );
      return;
    }

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
      .json(
        new ApiResponse(201, userDto, 'User registered seccessfully', true)
      );
  } catch (error: any) {
    const { message } = error;
    res.status(500).json(new ApiError(500, error, false, message));
  }
});

const updateUserAvatar = createExpressHandler(async (req, res) => {});

export {
  changeCurrentPassword,
  handleSocialLogin,
  loginUser,
  logoutUser,
  registerUser,
  updateUserAvatar,
};
