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
        notEmpty: { args: true, msg: 'Please enter your name' },
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { args: true, msg: 'You must include a password' },
      },
    },
    email: {
      type: DataTypes.STRING,
      // unique: {
      //   args: true,
      //   message: 'Username must be unique.',
      //   fields: [sequelize.fn('lower', sequelize.col('email'))],
      // },
      validate: {
        isEmail: { args: true, msg: 'You didn`t actually include an email' },
        notEmpty: { args: true, msg: 'You must include an email' },
        // isUnique(value) {
        //   user.findOne({ where: { email: value } }).then(() => {
        //     msg: 'This email already exists!',
        //     // throw new Error('This email already exists!');
        //   });
        // },
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
      defaultValue: 'None',
    },
    occupation: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { args: true, msg: 'You must include an ocupation' },
      },
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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

  return user;
};
