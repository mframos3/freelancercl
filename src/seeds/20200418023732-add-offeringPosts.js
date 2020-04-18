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
    const offeringPostsData = [
      {
        name: 'Se busca consultor informático.',
        category: 'Tecnología, Computación, Ingeniería',
        description: 'Se requiere programador con al menos 2 años de experiencia para pizzería.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('offeringPosts', offeringPostsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('offeringPosts', null, {}),
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
};
