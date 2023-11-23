import { sequelize } from '../db/db';
import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/apiError';

const User = sequelize.define('User', {
  givenName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false,
  },
});

async function register(
  givenName: string,
  lastName: string = '',
  email: string,
  userName: string,
  password: string,
  avatar: string = '/dummy_profile_image.jpeg',
  role: string = 'user'
): Promise<{
  id: number;
  givenName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  avatar: string;
  role: string;
}> {
  try {
    const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await User.create({
      givenName,
      lastName,
      email,
      userName,
      password: hashedPassword,
      avatar,
      role,
    });

    return await user.toJSON();
  } catch (error) {
    throw new ApiError(400, error, false, 'User already exists');
  }
}

async function getUserByUsername(userName: string) {
  try {
    const user = await User.findOne({ where: { userName } });
    if (!user) {
      return null;
    }
    return await user.toJSON();
  } catch (error) {
    throw error;
  }
}
async function getUserByEmail(email: string) {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    return await user.toJSON();
  } catch (error) {
    throw error;
  }
}

async function isPasswordCorrect(userName: string, password: string) {
  try {
    const user = await getUserByUsername(userName);
    if (!user) {
      return false;
    }
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    return isPasswordCorrect;
  } catch (error) {
    throw error;
  }
}

async function generateAccessToken(userId: number, userName: string) {
  try {
    const secret = process.env.JWT_SECRET;
    const expiersIn = process.env.JWT_EXPIRES_IN;
    const token = await jwt.sign({ userId, userName }, String(secret), {
      expiresIn: expiersIn,
    });
    return token;
  } catch (error) {
    throw error;
  }
}
export {
  register,
  getUserByUsername,
  getUserByEmail,
  isPasswordCorrect,
  generateAccessToken,
};
