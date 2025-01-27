const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const result = await User.create(userBody);
  return result.dataValues;
};

const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

const getUserById = async (id) => {
  return User.findOne({ where: { id } });
};

const getUserByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
};
