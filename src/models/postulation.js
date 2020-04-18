module.exports = (sequelize, DataTypes) => {
  const postulation = sequelize.define('postulation', {
    userId: DataTypes.INTEGER,
    offeringPostId: DataTypes.INTEGER,
    content: DataTypes.STRING,
  }, {});
  postulation.associate = function associate() {
    // postulation.belongsTo(models.offeringPost, { foreignKey: 'offeringPostId' });
    // aquí falta asociar a user
  };
  return postulation;
};
