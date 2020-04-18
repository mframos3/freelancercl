module.exports = {
  up: (queryInterface) => {
    const postulationsData = [
      {
        userId: 1,
        offeringPostId: 1,
        content: 'Soy una inofensiva postulación',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('postulations', postulationsData);
  },
  down: (queryInterface) => queryInterface.bulkDelete('postulations', null, {}),
};
