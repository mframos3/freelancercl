module.exports = (sequelize, DataTypes) => {
  const offeringPost = sequelize.define('offeringPost', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        isAlpha: true,
      },
    },
    img: {
      type: DataTypes.STRING,
      defaultValue: '/src/images/defaultavatar.png',
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: 'General',
      validate: {
        isAlpha: true,
      },
    },
    description: {
      type: DataTypes.STRING,
      validate: {
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
    endsAt: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: false,
        isDate: true,
        isAfter: new Date().toString(),
      },
    },
  }, {});

  offeringPost.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    offeringPost.belongsTo(models.user, { foreignKey: 'userId' });
    offeringPost.hasMany(models.postulation);
    offeringPost.hasMany(models.report);
  };

  return offeringPost;
};
