module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'users',
    'linkedinFirstName',
    Sequelize.STRING,
  ),

  down: (queryInterface) => queryInterface.removeColumn(
    'users',
    'linkedinFirstName',
  ),
};
