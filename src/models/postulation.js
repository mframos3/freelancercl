module.exports = (sequelize, DataTypes) => {
  const postulation = sequelize.define('postulation', {
    userId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isInt: true,
      },
    },
    offeringPostId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isInt: true,
      },
    },
    content: {
      type: DataTypes.STRING,
      Validate: {
        notEmpty: false,
        isAlpha: true,
      },
    },
  }, {});
  postulation.associate = function associate(models) {
    postulation.belongsTo(models.offeringPost, { as: 'offeringPost', foreignKey: 'offeringPostId' });
    postulation.belongsTo(models.user, { as: 'user', foreignKey: 'userId' });
  };
  return postulation;
};
