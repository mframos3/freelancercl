module.exports = (sequelize, DataTypes) => {
  const offeringPost = sequelize.define('offeringPost', {
    name: DataTypes.STRING,
    img: DataTypes.STRING,
    category: DataTypes.STRING,
    description: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    endsAt: DataTypes.DATE,
  }, {});

  offeringPost.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
    // offeringPost.belongsTo(models.user, { foreignKey: 'userId' });

  };

  return offeringPost;
};
