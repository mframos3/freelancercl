module.exports = (sequelize, DataTypes) => {
  const follow = sequelize.define('follow', {
    followerId: {
      type: DataTypes.INTEGER,
    },
    followedId: {
      type: DataTypes.INTEGER,
    },
  }, {});

  follow.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    follow.belongsTo(models.user, { as: 'follower', foreignKey: 'followerId' });
    follow.belongsTo(models.user, { as: 'followed', foreignKey: 'followedId' });
  };

  return follow;
};
