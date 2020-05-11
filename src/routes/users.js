const KoaRouter = require('koa-router');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const PASSWORD_SALT = 10;
const { Op } = Sequelize;

const fileStorage = require('../services/file-storage');
const storage = require('../config/storage');

const router = new KoaRouter();

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
  return next();
}

router.get('users.list', '/', async (ctx) => {
  const result = ctx.request.query;
  const [term, type] = [result.search, result.type];
  let usersList = await ctx.orm.user.findAll();
  if (type === 'name') {
    usersList = await ctx.orm.user.findAll({ where: { name: { [Op.like]: `%${term}%` } } });
  } else if (type === 'email') {
    usersList = await ctx.orm.user.findAll({ where: { email: { [Op.eq]: term } } });
  }
  await ctx.render('users/index', {
    usersList,
    newUserPath: ctx.router.url('users.new'),
    showUserPath: (user) => ctx.router.url('users.show', { id: user.id }),
  });
});

router.get('users.new', '/new', async (ctx) => {
  const user = ctx.orm.user.build();
  await ctx.render('users/new', {
    user,
    submitUserPath: ctx.router.url('users.create'),
  });
});

router.post('users.create', '/', async (ctx) => {
  const user = ctx.orm.user.build(ctx.request.body);
  try {
    const {
      name, email, password, cvPath, imagePath, occupation,
    } = ctx.request.body;
    const cryptPassword = bcrypt.hashSync(password, PASSWORD_SALT);
    const emailRevisado = await ctx.orm.user.findOne({ where: { email } });
    if (emailRevisado == null) {
      await user.save({
        name, email, cryptPassword, cvPath, imagePath, occupation,
      });
      ctx.session.userId = user.id;
      ctx.redirect(ctx.router.url('index.landing'));
    } else {
      await ctx.render('users/new', {
        user,
        errors: { message: 'The email already exist.' },
        submitUserPath: ctx.router.url('users.create'),
      });
      // throw new Error('This email already exist.');
    }
  } catch (validationError) {
    await ctx.render('users/new', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.create'),
    });
  }
});

router.get('users.edit', '/:id/edit', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/edit', {
    user,
    submitUserPath: ctx.router.url('users.update', { id: user.id }),
  });
});

router.patch('users.update', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  try {
    const {
      name, email, cvPath, imagePath, occupation,
    } = ctx.request.body;
    await user.update({
      name, email, cvPath, imagePath, occupation,
    });
    ctx.redirect(ctx.router.url('users.list'));
  } catch (validationError) {
    await ctx.render('users/edit', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.update', { id: user.id }),
    });
  }
});

router.del('users.delete', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await user.destroy();
  ctx.redirect(ctx.router.url('users.list'));
});

router.get('users.show', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/show', {
    user,
    submitFilePath: ctx.router.url('users.uploadFile', { id: user.id }),
    editUserPath: ctx.router.url('users.edit', { id: user.id }),
    deleteUserPath: ctx.router.url('users.delete', { id: user.id }),
    sendMessagePath: ctx.router.url('messages.new', { id: user.id }),

  });
});

router.post('users.uploadFile', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  const { img, CV } = ctx.request.files;
  if (img.name) {
    user.imagePath = 'https://freelancercl.sfo2.digitaloceanspaces.com/' + img.name;
    await fileStorage.upload(img);
  }
  if (CV.name) {
    user.cvPath = 'https://freelancercl.sfo2.digitaloceanspaces.com/' + CV.name;
    await fileStorage.upload(CV);
  }
  await user.save();
  ctx.redirect(ctx.router.url('users.show', { id: user.id }));
});

module.exports = router;
