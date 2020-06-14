const faker = require('faker');

faker.locale = 'es';

const searchingPostsData = [];
const categories = ['General', 'Hogar', 'Educación', 'Música', 'Entretenimiento',
  'Deportes', 'Artes', 'Tele Trabajo', 'Emprendimiento', 'Investigación', 'Salud',
  'Asesoría', 'Otros'];

for (let i = 1; i < 10; i += 1) {
  searchingPostsData.push({
    name: `Busco trabajo como  ${faker.name.jobTitle()}`,
    img: `${faker.image.business()}?random=${Date.now()}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    description: faker.lorem.paragraph(2),
    userId: i,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('searchingPosts', searchingPostsData),

  down: (queryInterface) => queryInterface.bulkDelete('searchingPosts', null, {}),

};
