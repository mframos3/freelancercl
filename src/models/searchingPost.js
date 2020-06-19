module.exports = (sequelize, DataTypes) => {
  const searchingPost = sequelize.define('searchingPost', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    img: {
      type: DataTypes.STRING,
      defaultValue: 'https://freelancercl.sfo2.digitaloceanspaces.com/default-post.jpg',
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: 'General',
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.STRING,
      Validate: {
        notEmpty: false,
        len: [0, 300],
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isInt: true,
      },
    },
  }, {});

  searchingPost.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    searchingPost.belongsTo(models.user, { foreignKey: 'userId' });
    searchingPost.hasMany(models.report, { foreignKey: 'reportedPost' });
  };

  return searchingPost;
};
