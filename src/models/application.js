module.exports = (sequelize, DataTypes) => {
  const application = sequelize.define('application', {
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
  application.associate = function associate(models) {
    application.belongsTo(models.offeringPost, { as: 'offeringPost', foreignKey: 'offeringPostId' });
    application.belongsTo(models.user, { as: 'user', foreignKey: 'userId' });
  };
  return application;
};
