module.exports = (sequelize, DataTypes) => {
  const report = sequelize.define('report', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        len: [5, 20],
      },
    },
    content: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true,
        len: [20, 100],
      },
    },
    reportingUserId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isInt: true,
        // TODO: agregar custom validator para chequear id de usuario en plataforma es válido.
      },
    },
    reportedUserId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isInt: true,
        // TODO: agregar custom validator para chequear id de usuario en plataforma es válido.
      },
    },
    // TODO: refactor reportedPost->reportedPostId
    reportedPost: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isInt: true,
        // TODO: agregar custom validator para chequear id de usuario en plataforma es válido.
      },
    },

  }, {});

  report.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return report;
};
