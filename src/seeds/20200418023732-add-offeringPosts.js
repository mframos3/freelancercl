const faker = require('faker');

faker.locale = 'es';

const offeringPostsData = [];
const categories = ['General', 'Hogar', 'Educación', 'Música', 'Entretenimiento',
  'Deportes', 'Artes', 'Tele Trabajo', 'Emprendimiento', 'Investigación', 'Salud',
  'Asesoría', 'Otros'];

for (let i = 1; i < 11; i += 1) {
  offeringPostsData.push({
    name: `Ofrecemos trabajo de ${faker.name.jobType()}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    description: faker.lorem.paragraph(2),
    userId: i,
    img: `${faker.image.business()}?random=${Date.now()}`,
    endsAt: faker.date.future(1),
    price: Math.floor(Math.random() * (100000 - 20000 + 1)) + 200000,
    rating: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('offeringPosts', offeringPostsData),

  down: (queryInterface) => queryInterface.bulkDelete('offeringPosts', null, {}),
};
