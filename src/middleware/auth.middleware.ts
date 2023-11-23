import createExpressHandler from '../utils/expressHandler';
import ApiError from '../utils/apiError';
import ApiResponse from '../utils/apiResponse';
import jwt from 'jsonwebtoken';

const verifyAccessToken = createExpressHandler(async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      res
        .status(401)
        .json(new ApiError(401, null, false, `No accessToken found.`));
      return;
    }

    jwt.verify(
      accessToken,
      String(process.env.ACCESS_TOKEN_SECRET),
      (err: any, decoded: any) => {
        if (err) {
          const { message } = err;
          res.status(403).json(new ApiError(403, err, false, message));
          return;
        }

        req.body.decodedUserName = decoded.userName;
        req.body.decodedUserId = decoded.id;

        next();
      }
    );

    return;
  } catch (error: any) {
    console.error('Failed to verify accessToken:', error);
    const { message } = error;
    res.status(500).json(new ApiError(500, error, false, message));
  }
});
export { verifyAccessToken };
