const app = require('./app');
const sequelize = require('./config/database');
const config = require('./config/config');
const logger = require('./config/logger');

let server;

const startServer = () => {
  return new Promise((resolve, reject) => {
    server = app.listen(config.port, () => {
      logger.info(`Server is listening on port ${config.port}`);
      resolve(server);
    });

    server.on('error', (error) => {
      logger.error(`Error starting server: ${error.message}`);
      reject(error);
    });
  });
};

sequelize
  .authenticate()
  .then(() => startServer())
  .catch((error) => logger.error('Unable to connect to the database:', error));

sequelize
  .sync()
  .then(() => {
    console.log(' Database synchronize successfully!');
  })
  .catch((error) => {
    console.error('Unable to synchronize table : ', error);
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
