module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('follow', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    followedId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
        allowNull: false,
      },
    },
    followerId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
        allowNull: false,
      },
    },

    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }).then(() => queryInterface.addConstraint('follow', ['followedId', 'followerId'], {
    type: 'unique',
    name: 'follow_unique',
  })),
  down: (queryInterface) => queryInterface.dropTable('follow'),
};
