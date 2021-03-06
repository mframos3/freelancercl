const bcrypt = require('bcrypt');

const PASSWORD_SALT = 10;

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { args: true, msg: 'Debes ingresar un nombre.' },
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { args: true, msg: 'Debes ingresar una contraseña.' },
      },
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: { args: true, msg: 'Debes ingresar un email correcto.' },
        notEmpty: { args: true, msg: 'Debes ingresar un email.' },
      },
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        isFloat: true,
        min: 0,
        max: 5,
      },
    },
    cvPath: {
      type: DataTypes.STRING,
      validate: {
      },
    },
    linkedinFirstName: {
      defaultValue: null,
      type: DataTypes.STRING,
    },
    linkedinLastName: {
      defaultValue: null,
      type: DataTypes.STRING,
    },
    imagePath: {
      type: DataTypes.STRING,
      validate: {
      },
      defaultValue: 'https://freelancercl.sfo2.digitaloceanspaces.com/default-user-img.jpg',
    },
    occupation: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { args: true, msg: 'Debes ingresar una ocupación.' },
      },
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    cFollowers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      notEmpty: true,
    },
    cFollowed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      notEmpty: true,
    },
  }, {});

  user.beforeCreate(buildPasswordHash);
  user.beforeUpdate(buildPasswordHash);

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
    user.hasMany(models.application);
    user.hasMany(models.message, { as: 'sender', foreignKey: 'sender_id' });
    user.hasMany(models.message, { as: 'receiver', foreignKey: 'receiver_id' });
    user.hasMany(models.review, { foreignKey: 'id_worker' });
  };

  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  // user.prototype.actionFollower = function actionFollower(otherUser) {

  // }

  return user;
};
