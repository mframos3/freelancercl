module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'offeringPosts',
    'rating',
    Sequelize.FLOAT,
  ),

  down: (queryInterface) => queryInterface.removeColumn(
    'offeringPosts',
    'rating',
  ),
};
