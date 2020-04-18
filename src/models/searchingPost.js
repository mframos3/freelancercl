module.exports = (sequelize, DataTypes) => {
  const searchingPost = sequelize.define('searchingPost', {
    name: DataTypes.STRING,
    img: DataTypes.STRING,
    category: DataTypes.STRING,
    description: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  }, {});

  searchingPost.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
    // searchingPost.belongsTo(models.user, { foreignKey: 'userId' });
  };

  return searchingPost;
};
