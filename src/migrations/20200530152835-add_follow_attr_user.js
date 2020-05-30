module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'users',
      'cFollowers',
      Sequelize.INTEGER,
    );
    queryInterface.addColumn(
      'users',
      'cFollowed',
      Sequelize.INTEGER,
    );
  },

  down: (queryInterface) => {
    queryInterface.removeColumn(
      'users',
      'cFollowers',
    );
    queryInterface.removeColumn(
      'users',
      'cFollowed',
    );
  },
};
