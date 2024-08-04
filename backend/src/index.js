const app = require('./app');
const sequelize = require('./config/database')
const config = require('./config/config');
const logger = require('./config/logger');

let server;

sequelize.authenticate().then(()=>
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  })
).catch((error)=>
   logger.error('Unable to connect to the database:', error)
)

sequelize.sync().then(() => {
  console.log('Book table created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
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

