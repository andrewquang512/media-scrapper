const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');

const scrapMediaURL = require('../services/media.service');

const register = catchAsync(async (req, res) => {
  // const user = await userService.createUser(req.body);
  // const tokens = await tokenService.generateAuthTokens(user);
  const url =
    'https://www.google.com/search?q=dotnet&oq=dotnet&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQIxgnMgYIAhAjGCcyDAgDEAAYQxiABBiKBTISCAQQABhDGIMBGLEDGIAEGIoFMg0IBRAAGIMBGLEDGIAEMhAIBhAAGIMBGLEDGIAEGIoFMg0IBxAuGMcBGNEDGIAEMg0ICBAuGMcBGNEDGIAEMg0ICRAAGIMBGLEDGIAE0gEINDU5MGowajGoAgCwAgA&sourceid=chrome&ie=UTF-8';
  const filledArray = Array(10).fill(url);

  await scrapMediaURL(filledArray);

  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
};
