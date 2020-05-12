module.exports = (sequelize, DataTypes) => {
  const offeringPost = sequelize.define('offeringPost', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { args: true, msg: 'Include a name please' },
      },
    },
    img: {
      type: DataTypes.STRING,
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
    offeringPost.belongsTo(models.user, { as: 'user', foreignKey: 'userId' });
    offeringPost.hasMany(models.application);
    offeringPost.hasMany(models.report, { foreignKey: 'reportedPost' });
    offeringPost.hasMany(models.review, { foreignKey: 'id_post' });
  };

  return offeringPost;
};
