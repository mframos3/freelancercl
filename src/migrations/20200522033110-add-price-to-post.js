module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'offeringPosts',
    'price',
    Sequelize.INTEGER,
  ),

  down: (queryInterface) => queryInterface.removeColumn(
    'offeringPosts',
    'price',
  ),
};
