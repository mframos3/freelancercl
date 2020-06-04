const bcrypt = require('bcrypt');
const faker = require('faker');

faker.locale = 'es';
const PASSWORD_SALT = 10;

const usersData = [];

for (let i = 1; i < 11; i += 1) {
  usersData.push({
    id: i,
    name: faker.name.findName(),
    email: `user${i}@example.com`,
    password: bcrypt.hashSync('123456789', PASSWORD_SALT),
    imagePath: `${faker.image.people()}?random=${Date.now()}`,
    rating: 0,
    occupation: faker.name.jobTitle(),
    isAdmin: (i === 1),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('users', usersData),

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};
