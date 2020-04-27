const bcrypt = require('bcrypt');
const faker = require('faker');

const PASSWORD_SALT = 10;

module.exports = {
  up: (queryInterface) => {
    const usersData = [
      {
        name: faker.name.findName(),
        email: 'user1@example.com',
        password: bcrypt.hashSync('123456789', PASSWORD_SALT),
        rating: 3,
        occupation: 'jardinero',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        email: 'user2@example.com',
        password: bcrypt.hashSync('qwerty', PASSWORD_SALT),
        rating: 4,
        occupation: 'gasfiter',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('users', usersData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};
