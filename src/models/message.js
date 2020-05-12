module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    sender_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isInt: true,
      },
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isInt: true,
      },
    },
    content: {
      type: DataTypes.TEXT,
      validate: {
        len: [1, 120],
      },
    },
  }, {});

  message.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    message.belongsTo(models.user, { as: 'sender', foreignKey: 'sender_id' });
    message.belongsTo(models.user, { as: 'receiver', foreignKey: 'receiver_id' });
  };

  return message;
};
