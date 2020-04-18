module.exports = (sequelize, DataTypes) => {
  const postulation = sequelize.define('postulation', {
    userId: DataTypes.INTEGER,
    offeringPostId: DataTypes.INTEGER,
    content: DataTypes.STRING,
  }, {});
  postulation.associate = function associate() {
    // associations can be defined here
  };
  return postulation;
};
