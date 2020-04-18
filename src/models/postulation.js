module.exports = (sequelize, DataTypes) => {
  const postulation = sequelize.define('postulation', {
    userId: DataTypes.INTEGER,
    offeringPostId: DataTypes.INTEGER,
    content: DataTypes.STRING,
  }, {});
  postulation.associate = function associate(models) {
    postulation.belongsTo(models.offeringPost, { foreignKey: 'offeringPostId' });
    // postulation.belongsTo(models.user, { foreignKey: 'userId' });
  };
  return postulation;
};
