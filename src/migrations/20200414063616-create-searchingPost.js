module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('searchingPosts', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    name: {
      type: Sequelize.STRING,
    },
    img: {
      type: Sequelize.STRING,
    },
    category: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },

    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('searchingPosts'),
};
