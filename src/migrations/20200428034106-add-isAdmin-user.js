module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'users',
    'isAdmin',
    Sequelize.BOOLEAN,
  ),

  down: (queryInterface) => queryInterface.removeColumn(
    'users',
    'isAdmin',
  ),
};
