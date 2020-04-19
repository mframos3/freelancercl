module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    id_post: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isInt: true,
      },
    },
    id_worker: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isInt: true,
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        isFloat: true,
        min: 0,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      validate: {
        len: [0, 120],
      },
    },

  }, {});

  review.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return review;
};
