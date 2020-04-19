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
        len: [0, 120],
      },
    },
  }, {});

  message.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return message;
};
