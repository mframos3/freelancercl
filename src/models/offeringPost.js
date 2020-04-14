module.exports = (sequelize, DataTypes) => {
  const offeringPost = sequelize.define('offeringPost', {
    name: DataTypes.STRING,
    img: DataTypes.STRING,
    category: DataTypes.STRING,
    description: DataTypes.STRING,
  }, {});

  offeringPost.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return offeringPost;
};
