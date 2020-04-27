module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'users',
    'password',
    Sequelize.STRING,
  ),

  down: (queryInterface) => queryInterface.removeColumn(
    'users',
    'password',
  ),
};
