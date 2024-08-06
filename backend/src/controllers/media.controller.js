const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const scrapMediaURL = require('../services/media.service');

// const createUser = catchAsync(async (req, res) => {
//   const user = await userService.createUser(req.body);
//   res.status(httpStatus.CREATED).send(user);
// });
//
// const getUsers = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['name', 'role']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const result = await userService.queryUsers(filter, options);
//   res.send(result);
// });
//
// const getUser = catchAsync(async (req, res) => {
//   const user = await userService.getUserById(req.params.userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   res.send(user);
// });
//
// const updateUser = catchAsync(async (req, res) => {
//   const user = await userService.updateUserById(req.params.userId, req.body);
//   res.send(user);
// });
//
// const deleteUser = catchAsync(async (req, res) => {
//   await userService.deleteUserById(req.params.userId);
//   res.status(httpStatus.NO_CONTENT).send();
// });

const scrapURLs = catchAsync(async (req, res) => {
  const { URLs } = req.params;

  //   const url =
  //     'https://www.google.com/search?q=dotnet&oq=dotnet&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQIxgnMgYIAhAjGCcyDAgDEAAYQxiABBiKBTISCAQQABhDGIMBGLEDGIAEGIoFMg0IBRAAGIMBGLEDGIAEMhAIBhAAGIMBGLEDGIAEGIoFMg0IBxAuGMcBGNEDGIAEMg0ICBAuGMcBGNEDGIAEMg0ICRAAGIMBGLEDGIAE0gEINDU5MGowajGoAgCwAgA&sourceid=chrome&ie=UTF-8';
  //   const filledArray = Array(10).fill(url);
  //
  //   await scrapMediaURL(filledArray);

  const BATCH_SIZE = 100; // Adjust based on testing

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    await scrapMediaURL(batch);
    console.log(`Processed batch ${i / BATCH_SIZE + 1}`);
  }
});
const getUserURLs = catchAsync(async (req, res) => {
  const { URLs } = req.params;
});

module.exports = {
  scrapURLs,
  getUserURLs,
};
