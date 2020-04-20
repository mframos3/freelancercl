module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        notEmpty: true,
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
    cvPath: {
      type: DataTypes.STRING,
      validate: {
      },
      defaultValue: 'none',
    },
    imagePath: {
      type: DataTypes.STRING,
      validate: {
      },
      defaultValue: '/src/images/defaultavatar.png',
    },
    occupation: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
  }, {});

  user.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    user.belongsToMany(user, {
      as: 'following',
      through: models.follow,
      foreignKey: 'followerId',
      onDelete: 'cascade',
      hooks: true,
    });
    user.belongsToMany(user, {
      as: 'followers',
      through: models.follow,
      foreignKey: 'followedId',
      onDelete: 'cascade',
      hooks: true,
    });
    user.hasMany(models.report, { as: 'reportedUser', foreignKey: 'reportedUserId' });
    user.hasMany(models.report, { as: 'reportingUser', foreignKey: 'reportingUserId' });
    user.hasMany(models.offeringPost);
    user.hasMany(models.searchingPost);
    user.hasMany(models.postulation);
    user.hasMany(models.message, { as: 'sender', foreignKey: 'sender_id' });
    user.hasMany(models.message, { as: 'receiver', foreignKey: 'receiver_id'});
    user.hasMany(models.review, { foreignKey: 'id_worker' });
  };

  return user;
};