/* eslint no-console: "off" */

const server = require('./src/app');
const db = require('./src/models');

const PORT = process.env.PORT || 3000;

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
    server.listen(PORT, (err) => {
      if (err) {
        return console.error('Failed', err);
      }
      console.log(`Listening on port ${PORT}`);
      return server;
    });
  })
  .catch((err) => console.error('Unable to connect to the database:', err));
