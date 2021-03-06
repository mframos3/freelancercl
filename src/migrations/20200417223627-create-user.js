module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    rating: {
      type: Sequelize.FLOAT,
    },
    cvPath: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    linkedinFirstName: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    linkedinLastName: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    imagePath: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    occupation: {
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

  down: (queryInterface) => queryInterface.dropTable('users'),
};
