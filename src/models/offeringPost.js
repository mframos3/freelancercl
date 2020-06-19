module.exports = (sequelize, DataTypes) => {
  const offeringPost = sequelize.define('offeringPost', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { args: true, msg: 'Debes incluir un nombre.' },
      },
    },
    img: {
      type: DataTypes.STRING,
      defaultValue: 'https://freelancercl.sfo2.digitaloceanspaces.com/default-post.jpg',
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
    price: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isInt: true,
      },
    },
    rating: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: true,
        min: 0,
        max: 5,
      },
      defaultValue: 0,
    },
    endsAt: {
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty: false,
        isDate: true,
        isAfter: new Date().toString(),
      },
    },
    createdAt: {
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty: false,
        isDate: true,
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
