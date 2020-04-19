module.exports = {
  up: (queryInterface) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const searchingPostsData = [
      {
        name: 'Experimentado ingeniero informático busca proyecto por teletrabajo.',
        category: 'Tecnología, Computación, Ingeniería',
        description: 'Estoy buscando trabajo con duración máximo de 3 meses, esencialmente full stack developer.',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('searchingPosts', searchingPostsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('searchingPosts', null, {}),

};
