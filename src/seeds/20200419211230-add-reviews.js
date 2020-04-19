module.exports = {
  up: (queryInterface) => {
    const reviewsData = [
      {
        id_post: 1,
        id_worker: 1,
        rating: 5,
        comment: 'Muy buen trabajo, piden exactamente lo que necesitan!!',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_post: 2,
        id_worker: 1,
        rating: 1,
        comment: 'Nefato. Pedian por gasfiter y se necesitaba un médico.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('reviews', reviewsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('reviews', null, {}),
};
