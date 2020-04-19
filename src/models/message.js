module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    sender_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER,
    content: DataTypes.TEXT,
  }, {});

  message.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return message;
};
